const path = require('path');
const qz = require("../js/qz-tray")

// Shorthand
function print(x) { console.log(x); }

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
			data: "file://" + path.join(__dirname, "..", "assets", "pdf_sample.pdf")
		}];
		return qz.print(config, data).catch(function(e) { console.error(e); });

	} )

	.finally(() => {
		// Ensures disconnect happens even on error
		qz.websocket.disconnect().then(() => {
			console.log("Disconnected, exiting...");
			process.exit(0);  // force exit if needed
		});
	});

