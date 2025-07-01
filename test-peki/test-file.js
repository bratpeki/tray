
// Node libraries
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";

import { pdfComp } from "./utils/pdfComp.mjs"

// Piece de resistance!
import qz from "../js/qz-tray.js";

///////////////////////////////////////////////////////////////////////////

// OS username
const username = os.userInfo().username;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const qzroot = path.join(__dirname, "..");
const pdfSample = path.join(qzroot, "assets", "pdf_sample.pdf");

///////////////////////////////////////////////////////////////////////////

function sleep(x) { return new Promise(resolve => setTimeout(resolve, x)); }

function toPrintedFolderPath(filename) {
	return path.join(pdfPath, filename);
}

function toAssetFolderPath(filename) {
	return path.join(qzroot, "test-peki", "assets", filename);
}

let pdfPath;

switch ( os.platform() ) {

	case "win32":
		pdfPath = "";
		break;

	case "linux":
		pdfPath = path.join("/", "var", "spool", "cups-pdf", username);;
		break;

	case "darwin":
		pdfPath = path.join("/", "private", "var", "spool", "pdfwriter", username);
		break;

}

// Returns the full path
function getMostRecentPrinted() {

	var pdfList = fs.readdirSync(pdfPath);

	pdfList = pdfList.map(f => ({
		file: f,
		time: fs.statSync(path.join(pdfPath, f)).mtime.getTime()
	}));
	pdfList.sort((a, b) => b.time - a.time);

	return toPrintedFolderPath(pdfList[0].file);

}

///////////////////////////////////////////////////////////////////////////

( async () => {

	await qz.websocket.connect();

	const printers = await qz.printers.find();
	//// console.log("Printer list:");
	//// printers.forEach( f => console.log("  " + f) );

	// TODO: There's a chance the default printer is not a PDF printer
	//       That's probably gonna involve some naming convention we keep between ourselves
	const found = await qz.printers.getDefault();
	//// console.log("Set printer to default (" + found + ")");

	const config = qz.configs.create(found);
	var data = [{
		type: 'pixel',
		format: 'pdf',
		flavor: 'file',
		data: "file://" + pdfSample
	}];

	// The error catch without exiting ensures disconnection happens even on error
	await qz.print(config, data).catch(function(e) { console.error(e); });
	await qz.websocket.disconnect();

	// I'm aware of how stupid this is, LMAO
	// This is here because I assume printers don't have some sort of return value
	// I could listen on the directory and wait for the PDF to appear there, but it may appear before writing to it is finished
	// We'll see
	//// console.log("Waiting 1.5 seconds to make sure the PDF is there");
	await sleep(1500);

	console.assert( await pdfComp(getMostRecentPrinted(), toAssetFolderPath("basic.pdf"))   === true );
	// console.assert( await pdfComp(getMostRecentPrinted(), toAssetFolderPath("rotated.pdf")) === false );

	//// console.log("Exiting...");
	process.exit(0);

} )();
