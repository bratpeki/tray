
// generatePdfs.js

import path from "node:path";
import os from "node:os";
import { copyFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";

import WebSocket from "ws";

import { watchForNewPdf } from "../watcher/watchForNewPdf.js";
import { calculatePdfPrintPath } from "../split/calculatePdfPrintPath.js";
import { createDirectoryTree } from "../dir/createDirectoryTree.js"
import { osSplitter } from "../split/osSplitter.js";
import { configsPdf } from "../../configs/pdf.js";
import { configsImage } from "../../configs/image.js";
import { configsHtml } from "../../configs/html.js";

// Variables

// Recreations of the '__filename' and '__dirname' variables from CommonJS.
// https://stackoverflow.com/q/46745014
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Added because we need to call lpadmin directly to adjust print sizes.
// https://github.com/qzind/tray/issues/1409
//
// TODO: Remove when the issue is fixed.
import { execSync } from "node:child_process";
const islinux = os.platform() === "linux";

//     /..      /..   /..       /..
// tray/autotest/utils/functions/generate
const qzRoot = path.join(__dirname, "..", "..", "..", "..");

let samplePdfPath = path.join(qzRoot, "assets", "pdf_sample.pdf");
let sampleImagePath = path.join(qzRoot, "assets", "img", "image_sample.png");

// Browser URLs start with the root, and use forward slashes, so I adjusted sample paths here.
// If the platform is *Nix, there's no need for this, so there's no osSplitter call.
if ( os.platform() === "win32" ) {
	samplePdfPath = "/" + samplePdfPath.replace(/\\/g, "/");
	sampleImagePath = "/" + sampleImagePath.replace(/\\/g, "/");
}

// Where the PDF printer prints the prints...
// She sells seashells by the seashore!
let pdfPrintPath = calculatePdfPrintPath();

// Importing the QZ Tray API

// For a local Tray module reference via a relative path:
import qz from "../../../../js/qz-tray.js"

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

// Functions

// Process all the print jobs as they are defined by configs,
// printing the content of the data argument,
// and placing them in the PDF output hierarchy with the root being outputFolder.
//
// Does the following:
// 1. Prints the PDFs.
// 2. Finds them in the print location.
// 3. Moves them into the PDF directory tree in the according place.
async function processPrintJobs(outputFolder, configs, data, foundPrinter) {

	if (!configs || configs.length === 0) return;

	for (const configDef of configs) {

		console.log(`Processing '${configDef.options.jobName}'...`);

		const config = qz.configs.create(foundPrinter, configDef.options);

		// lpadmin call, more about that above.
		if (islinux) {
			try {
				execSync(`sudo lpadmin -p ${foundPrinter} -o PageSize=${configDef.lpadmincode}`);
			} catch (e) {
				console.error("Failed to set lpadmin PageSize:", e.message);
			}
		}

		await qz.print(config, data);

		// We wait for 5 minutes for the PDF to pop up.
		// Yes, printers on runners are that slow sometimes...
		const newPDF = await watchForNewPdf(pdfPrintPath, 5 * 60 * 1000);

		// The line below was removed because of cross-platform file moving issues (EXDEV).
		// Rather than moving, I copy and delete. That seems to work.
		//
		// await fs.rename(newPDF, path.join(outputFolder, ...configDef.outputPath));

		copyFileSync(newPDF, path.join(outputFolder, ...configDef.outputPath));
		unlinkSync(newPDF);

		// An attempt at fixing empty PDFs. Just a short sleep.
		// The error reads:
		//
		//  Error: Magick failed: Catalog dictionary not located in file, unable to proceed
		//   **** Error: Couldn't initialise file.
		//               Output may be incorrect.
		// Requested FirstPage is greater than the number of pages in the file: 0
		//   No pages will be processed (FirstPage > LastPage).
		// magick: no images found for operation `-alpha' at CLI arg 6 @ error/operation.c/CLIOption/5481.

		await new Promise(resolve => setTimeout(resolve, 1500));

	}

}


// Generates all the PDFs!
// The isPrint flags toggle printing of the sample PDF, Image and HTML, in that order.
export async function generatePdfs( outputFolder, isPrintPdf = true, isPrintImage = true, isPrintHtml = true ) {

	await createDirectoryTree(outputFolder);

	// Finding the PDF printer

	qz.api.setWebSocketType(WebSocket);
	await qz.websocket.connect();

	const found = await qz.printers.find(osSplitter("bullzip", "pdf", "pdf"));
	if (!found) throw new Error("ERROR (generatePdfs): No suitable PDF printer found");
	console.log(`USING PRINTER: ${found}`)

	// Setting 'data'

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
					<span style="color: #D00;">The color of this text is:</span> <pre>#D00</pre> <br/>
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

	// Printing

	if ( isPrintPdf ) await processPrintJobs(outputFolder, configsPdf, dataPdf, found);
	if ( isPrintImage ) await processPrintJobs(outputFolder, configsImage, dataImage, found);
	if ( isPrintHtml ) await processPrintJobs(outputFolder, configsHtml, dataHtml, found);

	// Closing

	await qz.websocket.disconnect();
	return;

}

