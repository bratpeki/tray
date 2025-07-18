// https://qz.io/api/qz.configs

// Node libraries
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";

import { watchForNewPdf } from "./utils/watchForNewPdf.mjs";
import { printConfigs } from "./utils/printConfigs.mjs";

// Piece de resistance!
import qz from "../js/qz-tray.js";

/////////////////////////////////////////////////////////////////////////// Variables

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

/////////////////////////////////////////////////////////////////////////// Functions

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

/////////////////////////////////////////////////////////////////////////// Finding the PDF printer

try {

	( async () => {

		await qz.websocket.connect();

		const found = await qz.printers.find("pdf");
		console.log(`USING PRINTER: ${found}`)

/////////////////////////////////////////////////////////////////////////// Setting 'data'

		const data = [{
			type: 'pixel',
			format: 'pdf',
			flavor: 'file',
			data: "file://" + pdfSample
		}];

/////////////////////////////////////////////////////////////////////////// Printing

		// TODO: I'm currently only checking for PDFs
		//       HTML and Image are skipping some stuff, so they don't all share the same rules
		//       Also, 'data' won't be the same, obviously
		for (const configDef of printConfigs) {

			console.log(`Processing: ${configDef.name}`);

			const config = qz.configs.create(found, configDef.options);

			await qz.print(config, data).catch( function (e) { console.error(e); } );

			const newPDF = await watchForNewPdf(pdfPath);

			// Quoting: https://www.geeksforgeeks.org/javascript/node-js-fs-rename-method/
			//
			// If a file already exists at the new path, it will be overwritten by the operation.
			//
			// So we're okay with running this even when assets exist.
			// TODO: This can be problematic if there's an old asset we no longer need, since we don't delete it.

			await fs.promises.rename(newPDF, toAssetFolderPath(configDef.outputPath));

		}

/////////////////////////////////////////////////////////////////////////// Closing

		await qz.websocket.disconnect();
		process.exit(0);

	} )();

} catch (err) {
	console.error(err.message);
}
