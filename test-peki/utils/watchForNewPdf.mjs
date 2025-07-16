
import fs from "fs";
import path from "path";

// dir is the target directory
// timeout is how long we wait in ms before calling the listen a failure
// retries is how many retries are made if the listen fails
//
// Returns the path to the PDF
export async function watchForNewPdf(dir, timeout = 5000, retries = 1) {

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
			// If final try, rethrow
			if (attempt === retries) throw err;
		}

	}

}

