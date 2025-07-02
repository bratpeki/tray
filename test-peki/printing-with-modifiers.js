// https://qz.io/api/qz.configs

// Node libraries
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";

// Piece de resistance!
import qz from "../js/qz-tray.js";

///////////////////////////////////////////////////////////////////////////

// OS username
const username = os.userInfo().username;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const qzroot = path.join(__dirname, "..");
const pdfSample = path.join(qzroot, "assets", "pdf_sample.pdf");

///////////////////////////////////////////////////////////////////////////

function sleep(x) { return new Promise(resolve => setTimeout(resolve, x)); }

///////////////////////////////////////////////////////////////////////////

( async () => {

	await qz.websocket.connect();

	const printers = await qz.printers.find();
	//// console.log("Printer list:");
	//// printers.forEach( f => console.log("  " + f) );

	// TODO: There's a chance the default printer is not a PDF printer
	//       That's probably gonna involve some naming convention we keep between ourselves
	const found = await qz.printers.getDefault();
	//// console.log("Set printer to default (" + found + ")");

	const config = qz.configs.create(
		found,
		{ rotation: 45 }
	);
	var data = [{
		type: 'pixel',
		format: 'pdf',
		flavor: 'file',
		data: "file://" + pdfSample
	}];

	// The error catch without exiting ensures disconnection happens even on error
	await qz.print(config, data).catch(function(e) { console.error(e); });
	await qz.websocket.disconnect();

	//// console.log("Exiting...");
	process.exit(0);

} )();
