// https://qz.io/api/qz.configs

// Node libraries
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";

import { watchForNewPdf } from "./utils/watchForNewPdf.mjs";

// Piece de resistance!
import qz from "../js/qz-tray.js";

///////////////////////////////////////////////////////////////////////////

// OS username
const username = os.userInfo().username;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const qzroot = path.join(__dirname, "..");
const pdfSample = path.join(qzroot, "assets", "pdf_sample.pdf");

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

///////////////////////////////////////////////////////////////////////////

function sleep(x) { return new Promise(resolve => setTimeout(resolve, x)); }

// Printed PDF
function toPrintedFolderPath(filename) {
	return path.join(pdfPath, filename);
}

// QZ printed PDF assets
// Accepts a list since you can specify OS and raster/vector
function toAssetFolderPath(filenames) {
	var tmp = path.join(qzroot, "test-peki", "assets");
	filenames.forEach( f => { tmp = path.join(tmp, f); } );
	return tmp;
}

// Returns the full path
function getMostRecentPrinted() {

	var pdfList = fs.readdirSync(pdfPath);
	if ( pdfList.length === 0 ) throw new Error("pdfList is empty!");

	pdfList = pdfList.map(f => ({
		file: f,
		time: fs.statSync(path.join(pdfPath, f)).mtime.getTime()
	}));
	pdfList.sort((a, b) => b.time - a.time);

	return toPrintedFolderPath(pdfList[0].file);

}

///////////////////////////////////////////////////////////////////////////

try {

	( async () => {

		await qz.websocket.connect();

		const found = await qz.printers.find("pdf");
		console.log("USING PRINTER: " + found)

///////////////////////////////////////////////////////////////////////////

		const config = qz.configs.create(
			found,
			{ rotation: 45 }
		);

		var data = [{
			type: 'pixel',
			format: 'pdf',
			flavor: 'file',
			data: "file://" + pdfSample
		}];

		await qz.print(config, data).catch(function(e) { console.error(e); });

		const newPDF = await watchForNewPdf(pdfPath);

		await fs.promises.rename(
			newPDF,
			toAssetFolderPath(["linux_cupspdf", "raster", "rot45.pdf"])
		);

///////////////////////////////////////////////////////////////////////////

		await qz.websocket.disconnect();
		process.exit(0);

	} )();

} catch (err) {
	console.error(err.message);
}
