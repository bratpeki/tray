// https://qz.io/api/qz.configs

// Node libraries
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";

import { watchForNewPdf } from "./utils/functions/watchForNewPdf.mjs";

import { configsPdf } from "./utils/configs/pdf.mjs";
import { configsImage } from "./utils/configs/image.mjs";
import { configsHtml } from "./utils/configs/html.mjs";

// Piece de resistance!
import qz from "../js/qz-tray.js";

/////////////////////////////////////////////////////////////////////////// Variables

// OS username
const username = os.userInfo().username;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const qzroot = path.join(__dirname, "..");

const samplePdf = path.join(qzroot, "assets", "pdf_sample.pdf");
const sampleImage = path.join(qzroot, "assets", "img", "image_sample.png");

let pdfPath;

switch ( os.platform() ) {

	case "win32":
		pdfPath = ""; // TODO
		break;

	case "linux":
		pdfPath = path.join("/", "var", "spool", "cups-pdf", username);
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

// TODO: Purely for testing purposes
const isPrintPdf = false;
const isPrintImage = false;
const isPrintHtml = true;

/////////////////////////////////////////////////////////////////////////// Finding the PDF printer

try {

	( async () => {

		await qz.websocket.connect();

		const found = await qz.printers.find("pdf");
		console.log(`USING PRINTER: ${found}`)

/////////////////////////////////////////////////////////////////////////// Setting 'data'

		const dataPdf = [{
			type: 'pixel',
			format: 'pdf',
			flavor: 'file',
			data: "file://" + samplePdf
		}];

		const dataImage = [{
			type: 'pixel',
			format: 'image',
			flavor: 'file',
			data: "file://" + sampleImage
		}];

		const dataHtml = [{
			type: 'pixel',
			format: 'html',
			flavor: 'plain',
			data: '<html>' +
				'<body>' +
				'  <table style="font-family: monospace; width: 100%">' +
				'    <tr>' +
				'      <td>' +
				'        <h2>* QZ Tray HTML Sample Print *</h2>' +
				'        <span style="color: #D00;">Version:</span> ' + await qz.api.getVersion() + '<br/>' +
				'        <span style="color: #D00;">Source:</span> https://qz.io/' +
				'      </td>' +
				'      <td align="right">' +
				'        <img src="' + sampleImage + '" />' +
				'      </td>' +
				'    </tr>' +
				'  </table>' +
				'</body>' +
				'</html>'
		}];

/////////////////////////////////////////////////////////////////////////// Printing: PDF

		// TODO: I'm currently only checking for PDFs
		//       HTML and Image are skipping some stuff, so they don't all share the same rules
		//       Also, 'data' won't be the same, obviously

		if ( isPrintPdf )
		for ( const configDef of configsPdf ) {

			console.log(`Processing '${configDef.name}'...`);

			const config = qz.configs.create(found, configDef.options);

			await qz.print(config, dataPdf).catch( function (e) { console.error(e); } );

			const newPDF = await watchForNewPdf(pdfPath);

			// Quoting: https://www.geeksforgeeks.org/javascript/node-js-fs-rename-method/
			//
			// If a file already exists at the new path, it will be overwritten by the operation.
			//
			// So we're okay with running this even when assets exist.
			// TODO: This can be problematic if there's an old asset we no longer need, since we don't delete it.

			// Experimentally confirmed fs.rename doesn't make new directories
			// Currently, all preparations of the folders is done in the Makefile

			await fs.promises.rename(newPDF, toAssetFolderPath(configDef.outputPath));

		}

/////////////////////////////////////////////////////////////////////////// Printing: Image

		if ( isPrintImage )
		for ( const configDef of configsImage ) {

			console.log(`Processing '${configDef.name}'...`);

			const config = qz.configs.create(found, configDef.options);

			await qz.print(config, dataImage).catch( function (e) { console.error(e); } );

			const newPDF = await watchForNewPdf(pdfPath);

			await fs.promises.rename(newPDF, toAssetFolderPath(configDef.outputPath));

		}

/////////////////////////////////////////////////////////////////////////// Printing: HTML

		if ( isPrintHtml )
		for ( const configDef of configsHtml ) {

			console.log(`Processing '${configDef.name}'...`);

			const config = qz.configs.create(found, configDef.options);

			await qz.print(config, dataHtml).catch( function (e) { console.error(e); } );

			const newPDF = await watchForNewPdf(pdfPath);

			await fs.promises.rename(newPDF, toAssetFolderPath(configDef.outputPath));

		}

/////////////////////////////////////////////////////////////////////////// Closing

		await qz.websocket.disconnect();
		process.exit(0);

	} )();

} catch (err) {
	console.error(err.message);
}
