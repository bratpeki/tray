
// watchForNewPdf.js

import * as path from "node:path";
import { promises as fs } from "node:fs";

import * as chokidar from "chokidar";

// Wait until the given file is no longer locked (i.e. can be opened for reading).
//
// Node adopted the POSIX error codes:
// https://en.wikipedia.org/wiki/Errno.h
async function waitForFileReady(filePath, retries = 50, delay = 500) {

	const tempPath = filePath + ".readycheck";

	for (let i = 0; i < retries; i++) {
		// console.log(`  DEBUG: Trying to rename ${filePath} --> ${tempPath} (retry ${i})`);
		try {
			await fs.rename(filePath, tempPath);
			// console.log(`  DEBUG: Trying to rename ${tempPath} --> ${filePath}`);
			await fs.rename(tempPath, filePath);
			return;
		}

		catch (err) {
			// Sleep if the file is still busy
			if (err.code === "EBUSY") {
				// console.log(`  DEBUG: EBUSY!... Sleeping for ${delay}ms for ${filePath}`);
				await new Promise((r) => setTimeout(r, delay));
			}
			else { throw err; }
		}

	}

	throw new Error(`File ${filePath} remained locked after ${retries * delay}ms`);

}

// The actual watcher used for the PDFs.
//
// We first check that the directory exists.
// Then, if it's not there, we wait for it to appear.
//
// timeout is in miliseconds, so it's 60 seconds.
// If the PDF is not found with that time, the watcher bails.
//
// Returns the path to the PDF.
export async function watchForNewPdf(dir, timeout = 60000) {

	// console.log(`  DEBUG: Checking directory for existing files: ${dir}...`);

	const files = await fs.readdir(dir);
	const immediateFile = files.find(f => path.extname(f).toLowerCase() === ".pdf");

	if (immediateFile) {

		const fullPath = path.join(dir, immediateFile);
		// console.log(`  DEBUG: File already exists, skipping watcher: ${fullPath}`);

		// Sleeping because of a MacOS issue:
		// "Requested FirstPage is greater than the number of pages in the file: 0"
		await new Promise(resolve => setTimeout(resolve, 2 * 1000));

		await waitForFileReady(fullPath);
		return fullPath;

	}

	return new Promise((resolve, reject) => {

		// console.log(`  DEBUG: Adding listener to directory: ${dir}...`);

		const watcher = chokidar.watch(dir, {
			ignoreInitial: false,
			depth: 0,
			// https://github.com/paulmillr/chokidar?tab=readme-ov-file#performance
			// stabilityThreshold: For how long must a file remain the same size before the watcher responds
			// pollInterval: How often the file is "asked" for his size
			awaitWriteFinish: { stabilityThreshold: 5 * 1000, pollInterval: 10 },
		});

		const timer = setTimeout(() => {
			watcher.close();
			reject(new Error("Timeout: No new PDF detected on " + dir));
		}, timeout);

		// console.log(`  DEBUG: Listener added, to directory ${dir}, waiting for 'add' event...`);

		watcher.on("add", async (filePath) => {

			// console.log(`  DEBUG: File added: ${filePath}`);

			if (path.extname(filePath).toLowerCase() !== ".pdf") return;

			clearTimeout(timer);
			watcher.close();

			try {
				await waitForFileReady(filePath);
				resolve(filePath);
			}
			catch(err) {
				reject(err);
			}

		});

		// https://github.com/paulmillr/chokidar?tab=readme-ov-file#methods--events
		// Added just to be safe
		watcher.on("error", (err) => {
			clearTimeout(timer);
			watcher.close();
			reject(err);
		});

	});

}

