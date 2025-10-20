
// Converts PDF files on 'pdfPath' to a pixel buffer
// The output is a buffer array of size W*H*4, each pixel needs 4 bytes for RGBA values
//
// So, the format of the output is a dict with the format {data, width, height}
//

import { promises as fs } from "fs";
import path from "path";
import os from "os";

import { PNG } from "pngjs";
import Poppler from "pdf-poppler";

/**
 * Converts the first page of a PDF file to an RGBA pixel buffer.
 *
 * Creates a PNG in a temp directory using:
 * - {@link https://nodejs.org/api/fs.html#fspromisesmkdtempprefix-options}.
 * - {@link https://www.npmjs.com/package/pngjs}
 *
 * The returned object contains `data`,
 * a `Uint8Array` with the format `[ R,G,B,A, R,G,B,A, R,G,B,A, ... ]`
 * and with a size of `width * height * 4` bytes.
 *
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<{data: Uint8Array, width: number, height: number}>}
 */
export async function pdf2rgba(pdfPath) {

	// Create a temp dir
	const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf2rgba-"));

	const outPrefix = path.join(tmpDir, "page");

	// Render page 1 to PNG
	await Poppler.convert(pdfPath, {
		format: "png",
		out_dir: tmpDir,
		out_prefix: "page",
		page: 1,
		dpi: 72
	});

	// Load the PNG into RGBA buffer
	const pngPath = `${outPrefix}-1.png`;
	const pngData = await fs.readFile(pngPath);
	const png = PNG.sync.read(pngData);

	// Cleanup temp dir
	// TODO:
	//     I'm thinking this is okay, since you're probably
	//     gonna run the script multiple times in one session,
	//     so it reduces clutter.
	await fs.rm(tmpDir, { recursive: true, force: true });

	return {
		data: png.data,
		width: png.width,
		height: png.height,
	};

}
