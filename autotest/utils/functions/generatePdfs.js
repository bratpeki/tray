
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";

import { watchForNewPdf } from "./watchForNewPdf.js";
import { calculatePdfPrintPath } from "./calculatePdfPrintPath.js";
import { createDirectoryTree } from "./createDirectoryTree.js"

import { configsPdf } from "../configs/pdf.js";
import { configsImage } from "../configs/image.js";
import { configsHtml } from "../configs/html.js";

/////////////////////////////////////////////////////////////////////////// Variables

// Recreations of the '__filename' and '__dirname' variables from CommonJS
// https://stackoverflow.com/q/46745014
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//     /..      /..   /..
// tray/autotest/utils/functions
const qzRoot = path.join(__dirname, "..", "..", "..");

const samplePdfPath = path.join(qzRoot, "assets", "pdf_sample.pdf");
const sampleImagePath = path.join(qzRoot, "assets", "img", "image_sample.png");

// Where the PDF printer prints the prints...
// She sells seashells by the seashore
let pdfPrintPath = calculatePdfPrintPath();

/////////////////////////////////////////////////////////////////////////// Importing the QZ Tray API

// For a local Tray module reference via a relative path:
import qz from "../../../js/qz-tray.js"

// For a dynamic path:
/*
const qz = (
	await import(path.join(qzRoot, "js", "qz-tray.js"))
).default;
*/
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#importing_defaults

// For the NPM module, using ECMAScript:
// import qz from "qz-tray";
// You would, of course, need to run 'npm install qz-tray'

/////////////////////////////////////////////////////////////////////////// Functions

/**
 * Does the following:
 * <ul>
 *   <li> Prints the PDFs </li>
 *   <li> Finds them in the print location </li>
 *   <li> Moves them into the PDF directory tree in the according place </li>
 * </ul>
 *
 * @async
 * @param {string} outputFolder - The root of the directory tree we want to place the PDF in
 * @param {Array} configs - The list of configs, as available in <code>utils/configs</code>
 * @param {Object} data - The content we want to print
 * @param {string} foundPrinter - The PDF printer we want to use, found with <code>qz.printers.find</code>
 * @throws Throws an error if any print job fails. <p/>
 */
async function processPrintJobs(outputFolder, configs, data, foundPrinter) {

	if ( !configs || configs.length === 0 ) return;

	for ( const configDef of configs ) {

		console.log(`Processing '${configDef.name}'...`);

		const config = qz.configs.create(foundPrinter, configDef.options);
		await qz.print(config, data);

		const newPDF = await watchForNewPdf(pdfPrintPath);
		await fs.rename(newPDF, path.join(qzRoot, "autotest", outputFolder, ...configDef.outputPath));

	}

}

/**
 * Generates all the PDFs!
 *
 * <p/>
 *
 * Uses {@link processPrintJobs}.
 *
 * @async
 * @param {string} outputFolder - The root of the directory tree we want to place the PDFs in
 * @param {boolean} isPrintPdf [true] - A flag which toggles printing the Sample PDF
 * @param {boolean} isPrintImage [true] - A flag which toggles printing the Sample Image
 * @param {boolean} isPrintHtml [true] - A flag which toggles printing the Sample HTML
 * @throws Throws an error if any print job fails. <p/>
 */
export async function generatePdfs( outputFolder, isPrintPdf = true, isPrintImage = true, isPrintHtml = true ) {

	await createDirectoryTree(outputFolder);

	/////////////////////////////////////////////////////////////////////////// Finding the PDF printer

	await qz.websocket.connect();

	const found = await qz.printers.find("pdf");
	if (!found) throw new Error("ERROR (generatePdfs): No suitable PDF printer found");
	console.log(`USING PRINTER: ${found}`)

	/////////////////////////////////////////////////////////////////////////// Setting 'data'

	// Tray HTML printing jobs block external resources by default.
	// The one exception are paths matching "demo/assets", for the purposes of "Print PDF", "Print Image" and "Print HTML"
	//
	// A quick look at 'qz-tray -h' reveals that setting 'security.data.protocols' allows any image to be passed for printing
	//
	// Image links in HTML files have to be prepended with the protocol, which is why 'file://' is added to 'samplePdf' and 'sampleImage'

	const dataPdf = [{
		type: 'pixel',
		format: 'pdf',
		flavor: 'file',
		data: "file://" + samplePdfPath
	}];

	const dataImage = [{
		type: 'pixel',
		format: 'image',
		flavor: 'file',
		data: "file://" + sampleImagePath
	}];

	const qzVersion = await qz.api.getVersion();

	const dataHtml = [{
		type: 'pixel',
		format: 'html',
		flavor: 'plain',
		data: `
			<html>
			<body>
				<table style="font-family: monospace; width: 100%">
				<tr>
					<td>
					<h2>* QZ Tray HTML Sample Print *</h2>
					<span style="color: #D00;">Version:</span> ${qzVersion}<br/>
					<span style="color: #D00;">Source:</span> https://qz.io/
					</td>
					<td align="right">
					<img src="file://${sampleImagePath}" />
					</td>
				</tr>
				</table>
			</body>
			</html>
		`
	}];

	/////////////////////////////////////////////////////////////////////////// Printing

	if ( isPrintPdf ) await processPrintJobs(outputFolder, configsPdf, dataPdf, found);
	if ( isPrintImage ) await processPrintJobs(outputFolder, configsImage, dataImage, found);
	if ( isPrintHtml ) await processPrintJobs(outputFolder, configsHtml, dataHtml, found);

	/////////////////////////////////////////////////////////////////////////// Closing

	await qz.websocket.disconnect();
	return;

}

