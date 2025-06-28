// Prints a PDF.
// Opens that PDF and the PDF we're comparing two and saves them as PNG.
// Compares the PNGs.

// Get an OS-agnostic path from strings
// Given how I'm using CUPS-PDF,
//   as of now I'm assuming we're running these on Linux systems
//   and I'll adjust it for Mac down the line.
// const path = require('path');
import path from "path";

// List files in a directory
// const fs = require('fs');
import fs from "fs";

// Had to be included for EcmaScript
import os from "os";
import { fileURLToPath } from "url";

// This uses PDFJS-DIST, which runs on EcmaScript
// If one thing runs on EcmaScript, EVERYTHING runs on EcmaScript
// Well, either that or we call Node multiple times for a single PDF check (once for the Ecma stuff, once for CommonJS)
// For now, let me just have an MVP
import { pdf2pixels } from "./utils/pdf2png.mjs";
import pixelmatch from "pixelmatch";
import { PNG } from 'pngjs';

// Piece de resistance!
// const qz = require("../js/qz-tray");
import qz from "../js/qz-tray.js";

///////////////////////////////////////////////////////////////////////////

// OS username
const username = os.userInfo().username;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const qzroot = path.join(__dirname, "..");
const pdfSample = path.join(qzroot, "assets", "pdf_sample.pdf");

function print(x) { console.log(x); }
function sleep(x) { return new Promise(resolve => setTimeout(resolve, x)); }

///////////////////////////////////////////////////////////////////////////

async function same(path1, path2) {

	try {

		const img1 = await pdf2pixels(path1);
		const img2 = await pdf2pixels(path2);
		print("aaa"); // Doesn't print, files also don't exist

		if (img1.width !== img2.width || img1.height !== img2.height) {
			throw new Error("Images have different dimensions");
		}

		const diffBuffer = new Uint8ClampedArray(img1.width * img1.height * 4);

		const numDiffPixels = pixelmatch(
			img1.data,
			img2.data,
			diffBuffer,
			img1.width,
			img1.height,
			{ threshold: 0.1 }
		);

		return numDiffPixels === 0;

	}
	catch (error) { throw error; }

}

///////////////////////////////////////////////////////////////////////////

( async () => {

	await qz.websocket.connect();

	const printers = await qz.printers.find();
	print("Printer list:");
	printers.forEach( f => print("  " + f) );

	const found = await qz.printers.getDefault();
	print("Set printer to default (" + found + ")");

	const config = qz.configs.create(found);
	var data = [{
		type: 'pixel',
		format: 'pdf',
		flavor: 'file',
		// A bit of explanation is in order here.
		// We're in the testing directory, we go back into the root, and the to the PDF sample to print it.
		data: "file://" + pdfSample
	}];

	// The error catch without exiting ensures disconnection happens even on error
	await qz.print(config, data).catch(function(e) { console.error(e); });
	await qz.websocket.disconnect();

	// I'm aware of how stupid this is, LMAO
	// This is here because I assume printers don't have some sort of return value
	// I could listen on the directory and wait for the PDF to appear there, but it may appear before writing to it is finished
	// We'll see
	print("Waiting 1.5 seconds to make sure the PDF is there");
	await sleep(1500);

	const pdfPath = path.join("/", "var", "spool", "cups-pdf", username);

	var pdfList = fs.readdirSync(pdfPath);
	pdfList = pdfList.map(f => ({
		file: f,
		time: fs.statSync(path.join(pdfPath, f)).mtime.getTime()
	}));
	pdfList.sort((a, b) => b.time - a.time);

	const pdfTarget = pdfList[0].file;

	print("Listing contents of " + pdfPath + ": " + pdfList.map(f => f.file));
	print("Target: " + path.join(pdfPath, pdfTarget));
	print("Compare to: " + path.join(qzroot, "test-peki", "assets", "basic.pdf"));

	var file1 = path.join(pdfPath, pdfTarget);
	var file2 = path.join(qzroot, "test-peki", "assets", "basic.pdf");
	var res = await same(file1, file2);

	if ( res ) { print(" -> Files are identical!"); }
	else       { print(" -> Files are different!"); }

	var file2 = path.join(qzroot, "test-peki", "assets", "rotated.pdf");
	var res = await same(file1, file2);

	if ( res ) { print(" -> Files are identical!"); }
	else       { print(" -> Files are different!"); }

	print("Exiting...");
	process.exit(0);

} )();
