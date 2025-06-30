
// Node, ES libraries
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

// OS-dependent code here in the future
const pdfPath = path.join("/", "var", "spool", "cups-pdf", username);

function toPrintedFolderPath(filename) {
	return path.join(pdfPath, filename);
}

function toAssetFolderPath(filename) {
	return path.join(qzroot, "test-peki", "assets", filename);
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
	console.log("Printer list:");
	printers.forEach( f => console.log("  " + f) );

	const found = await qz.printers.getDefault();
	console.log("Set printer to default (" + found + ")");

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
	console.log("Waiting 1.5 seconds to make sure the PDF is there");
	await sleep(1500);

	var res = await pdfComp(
		getMostRecentPrinted(),
		toAssetFolderPath("basic.pdf")
	);
	console.assert(res === true);

	var res = await pdfComp(
		getMostRecentPrinted(),
		toAssetFolderPath("rotated.pdf")
	);
	console.assert(res === false);

	console.log("Exiting...");
	process.exit(0);

} )();
