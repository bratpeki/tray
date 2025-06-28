
// Node, ES libraries
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";

// This uses PDFJS-DIST, which runs on EcmaScript
// If one thing runs on EcmaScript, EVERYTHING runs on EcmaScript
// Well, either that or we call Node multiple times for a single PDF check (once for the Ecma stuff, once for CommonJS)
// For now, let me just have an MVP
import { pixelsComp } from "./utils/pixelsComp.mjs";

// Piece de resistance!
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
	var res = await pixelsComp(file1, file2);

	if ( res ) { print(" -> Files are identical!"); }
	else       { print(" -> Files are different!"); }

	var file2 = path.join(qzroot, "test-peki", "assets", "rotated.pdf");
	var res = await pixelsComp(file1, file2);

	if ( res ) { print(" -> Files are identical!"); }
	else       { print(" -> Files are different!"); }

	print("Exiting...");
	process.exit(0);

} )();
