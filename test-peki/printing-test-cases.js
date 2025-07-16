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

// dir is the target directory
// timeout is how long we wait in ms before calling the listen a failure
// retries is how many retries are made if the listen fails
async function watchForNewPDF(dir, timeout = 5000, retries = 1) {

	// Attempt loop
	for (let attempt = 0; attempt <= retries; attempt++) {

		try {

			// resolve and reject are signals of success and failure
			return await new Promise((resolve, reject) => {

				// Used to track the timeout so we can cancel it on success
				let timer;

				// 'persistent: true' keeps the Node.js process alive while watching
				const watcher = fs.watch(dir, { persistent: true }, (eventType, filename) => {

					// A newly created file usually emits a "rename" event in fs.watch
					// Yeah, it's weird, lol
					if (eventType === "rename") {

						const fullPath = path.join(dir, filename);

						// 'stat' checks the file information (isFile, isDirectory, etc)
						// If this passes, the file exists
						// So it's a final sanity check a new file was made, since the file could be made before being fully written
						fs.promises.stat(fullPath).then(() => {
							clearTimeout(timer); // Clear the timer
							watcher.close(); // Close the watcher
							resolve(fullPath); // Emit a resolve signal from the promise
						}).catch(() => {});

					}

				});

				// Failure
				timer = setTimeout(() => {
					watcher.close();
					reject(new Error("Timeout: No new PDF detected")); // Emit a reject from the promise
				}, timeout);

			});

		}

		catch (err) {
			if (attempt === retries) throw err; // If final try, rethrow
			console.warn(`[watchForNewPDF] Retry ${attempt + 1}...`);
		}

	}

}

///////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////

try {

	( async () => {

		await qz.websocket.connect();

		const found = await qz.printers.find("pdf");
		console.log("USING PRINTER: " + found)

///////////////////////////////////////////////////////////////////////////

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

		await qz.print(config, data).catch(function(e) { console.error(e); });

		const newPDF = await watchForNewPDF(pdfPath);

		await fs.promises.rename(
			newPDF,
			toAssetFolderPath(["linux_cupspdf", "raster", "rot45.pdf"])
		);

///////////////////////////////////////////////////////////////////////////

		await qz.websocket.disconnect();
		process.exit(0);

	} )();

} catch (err) {
	console.error(err.message);
}
