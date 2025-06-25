// Get an OS-agnostic path from strings
// Given how I'm using CUPS-PDF,
//   as of now I'm assuming we're running these on Linux systems
//   and I'll adjust it for Mac down the line.
const path = require('path');

// List files in a directory
const fs = require('fs');

// Piece de resistance!
const qz = require("../js/qz-tray");

///////////////////////////////////////////////////////////////////////////

// OS username
const username = require("os").userInfo().username;

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

	var config = qz.configs.create(found);
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

	pdfPath = path.join("/", "var", "spool", "cups-pdf", username);
	pdfList = fs.readdirSync(pdfPath);
	pdfTarget = pdfList[pdfList.length - 1];

	print("Listing contents of " + pdfPath + ": " + pdfList);
	print("Target: " + path.join(pdfPath, pdfTarget));

	console.log("Exiting...");
	process.exit(0);

} )();
