
import chokidar from "chokidar";
import path from "path";

/**
 * Uses {@link https://github.com/paulmillr/chokidar}
 *
 * @param {string} dir - The directory where we're listening for the new PDF
 * @param {number} timeout [5000] - Timeout period in miliseconds. If the PDF is not found, the watcher bails
 *
 * @returns {Promise<string>} The path to the PDF that's found
 */

export function watchForNewPdf(dir, timeout = 5000) {

	return new Promise((resolve, reject) => {

		const watcher = chokidar.watch(dir, {
			ignoreInitial: true,
			depth: 0,
			awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 10 },
		});

		const timer = setTimeout(() => {
			watcher.close();
			reject(new Error("Timeout: No new PDF detected"));
		}, timeout);

		watcher.on("add", (filePath) => {
			if (path.extname(filePath).toLowerCase() === ".pdf") {
				clearTimeout(timer);
				watcher.close();
				resolve(filePath);
			}
		});

	});

}