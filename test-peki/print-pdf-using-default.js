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

///////////////////////////////////////////////////////////////////////////

qz.websocket.connect()

	.then( () => { return qz.printers.find(); } )

	.then( (found) => {
		print("Printer list:");
		for ( var i = 0; i < found.length; i++ )
			print("  " + found[i]);
	} )

	.then( () => { return qz.printers.getDefault(); } )

	.then( (found) => {
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

		return qz.print(config, data).catch(function(e) { console.error(e); });
	} )

	.then( (x) => {
		// Ensures disconnect happens even on error
		qz.websocket.disconnect().then(async () => {

			// I'm aware of how stupid this is, LMAO!
			print("Waiting 3 seconds to make sure the PDF is there");
			await new Promise(resolve => setTimeout(resolve, 3000));

			pdfPath = path.join("/", "var", "spool", "cups-pdf", username);
			pdfList = fs.readdirSync(pdfPath);
			pdfTarget = pdfList[pdfList.length - 1];

			print("Listing contents of " + pdfPath + ": " + pdfList);
			print("Target: " + path.join(pdfPath, pdfTarget));

			console.log("Exiting...");
			process.exit(0);

		} );
	} )
