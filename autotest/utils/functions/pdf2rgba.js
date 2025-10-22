
import { promises as fs } from "fs";
import path from "path";
import os from "os";

import { PNG } from "pngjs";
import { fromBuffer, fromPath } from "pdf2pic";

const options = {
	density: 72,
	format: "png"
};


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

	const convert = fromPath(pdfPath, options);

	let result = await convert(1, { responseType: "buffer" });
	result = result.buffer;

	const png = PNG.sync.read(result);

	return {
		data: png.data,
		width: png.width,
		height: png.height,
	};

}
