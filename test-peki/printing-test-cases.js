// https://qz.io/api/qz.configs

// Node libraries
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";

import { watchForNewPdf } from "./utils/watchForNewPdf.mjs";

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
		console.log("USING PRINTER: " + found)

/////////////////////////////////////////////////////////////////////////// Setting 'data'

		const data = [{
			type: 'pixel',
			format: 'pdf',
			flavor: 'file',
			data: "file://" + pdfSample
		}];

/////////////////////////////////////////////////////////////////////////// Vector, base

		var config = qz.configs.create(
			found,
			{ size: {width: 8.5, height: 11}, units: 'in' }
		);

		await qz.print(config, data).catch(function(e) { console.error(e); });

		var newPDF = await watchForNewPdf(pdfPath);

		await fs.promises.rename(
			newPDF,
			toAssetFolderPath(["linux_cupspdf", "vector", "basic.pdf"])
		);

/////////////////////////////////////////////////////////////////////////// Raster, base

		var config = qz.configs.create(
			found,
			{ rasterize: true, size: {width: 8.5, height: 11}, units: 'in' }
		);

		await qz.print(config, data).catch(function(e) { console.error(e); });

		var newPDF = await watchForNewPdf(pdfPath);

		await fs.promises.rename(
			newPDF,
			toAssetFolderPath(["linux_cupspdf", "raster", "basic.pdf"])
		);

/////////////////////////////////////////////////////////////////////////// Vector, rotated 45 degrees

		var config = qz.configs.create(
			found,
			{ rotation: 45, size: {width: 8.5, height: 11}, units: 'in' }
		);

		await qz.print(config, data).catch(function(e) { console.error(e); });

		var newPDF = await watchForNewPdf(pdfPath);

		await fs.promises.rename(
			newPDF,
			toAssetFolderPath(["linux_cupspdf", "vector", "rot45.pdf"])
		);

/////////////////////////////////////////////////////////////////////////// Raster, rotated 45 degrees

		var config = qz.configs.create(
			found,
			{ rotation: 45, rasterize: true, size: {width: 8.5, height: 11}, units: 'in' }
		);

		await qz.print(config, data).catch(function(e) { console.error(e); });

		var newPDF = await watchForNewPdf(pdfPath);

		await fs.promises.rename(
			newPDF,
			toAssetFolderPath(["linux_cupspdf", "raster", "rot45.pdf"])
		);

/////////////////////////////////////////////////////////////////////////// Vector, orientation:reverse-landscape

		var config = qz.configs.create(
			found,
			{ orientation: "reverse-landscape", size: {width: 8.5, height: 11}, units: 'in' }
		);

		await qz.print(config, data).catch(function(e) { console.error(e); });

		var newPDF = await watchForNewPdf(pdfPath);

		await fs.promises.rename(
			newPDF,
			toAssetFolderPath(["linux_cupspdf", "vector", "orient_revland.pdf"])
		);

/////////////////////////////////////////////////////////////////////////// Vector, orientation:landscape

		var config = qz.configs.create(
			found,
			{ orientation: "landscape", size: {width: 8.5, height: 11}, units: 'in' }
		);

		await qz.print(config, data).catch(function(e) { console.error(e); });

		var newPDF = await watchForNewPdf(pdfPath);

		await fs.promises.rename(
			newPDF,
			toAssetFolderPath(["linux_cupspdf", "vector", "orient_land.pdf"])
		);


/////////////////////////////////////////////////////////////////////////// Raster, orientation:reverse-landscape

		var config = qz.configs.create(
			found,
			{ orientation: "reverse-landscape", rasterize: true, size: {width: 8.5, height: 11}, units: 'in' }
		);

		await qz.print(config, data).catch(function(e) { console.error(e); });

		var newPDF = await watchForNewPdf(pdfPath);

		await fs.promises.rename(
			newPDF,
			toAssetFolderPath(["linux_cupspdf", "raster", "orient_revland.pdf"])
		);

/////////////////////////////////////////////////////////////////////////// Raster, orientation:landscape

		var config = qz.configs.create(
			found,
			{ orientation: "landscape", rasterize: true, size: {width: 8.5, height: 11}, units: 'in' }
		);

		await qz.print(config, data).catch(function(e) { console.error(e); });

		var newPDF = await watchForNewPdf(pdfPath);

		await fs.promises.rename(
			newPDF,
			toAssetFolderPath(["linux_cupspdf", "raster", "orient_land.pdf"])
		);

/////////////////////////////////////////////////////////////////////////// Closing

		await qz.websocket.disconnect();
		process.exit(0);

	} )();

} catch (err) {
	console.error(err.message);
}
