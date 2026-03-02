
import { spawnSync } from "child_process";
import { PNG } from "pngjs";

/**
 * Converts the first page of a PDF file to an RGBA pixel buffer.
 *
 * The returned object contains `data`,
 * a `Uint8Array` with the format `[ R,G,B,A, R,G,B,A, R,G,B,A, ... ]`
 * and with a size of `width * height * 4` bytes.
 *
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<{data: Uint8Array, width: number, height: number}>}
 */
export async function pdf2rgba(pdfPath) {

	const convert = spawnSync("magick", [
		"-density", "72",
		`${pdfPath}[0]`,
		"-background", "white",
		"-alpha", "remove",
		"png:-" // Stream directly to buffer
	]);

	if (convert.status !== 0) {
		throw new Error(`Magick failed: ${convert.stderr.toString()}`);
	}

	if (!convert.stdout || convert.stdout.length === 0) {
		throw new Error("Magick output is empty!");
	}

	const png = PNG.sync.read(convert.stdout);

	return {
		data: png.data,
		width: png.width,
		height: png.height
	};

}
