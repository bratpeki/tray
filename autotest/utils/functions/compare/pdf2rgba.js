
// pdf2rgba.js

import { spawnSync } from "node:child_process";

import { PNG } from "pngjs";

import { osSplitter } from "../split/osSplitter.js"

// Converts the first page of a PDF file to an RGBA pixel buffer.
//
// Directly calls imagemagick and a PNG buffer is passed to stdout using "png:-".
// Then we use PNG.js to made a Uint8Array of size w * h * 4 bytes, the 4 bytes being RGBA.
// Returns the Uint8Array, as well as width and height in pixels.
export async function pdf2rgba(pdfPath) {

	const imagemagickCmd = osSplitter("magick", "convert", "magick");

	const convert = spawnSync(imagemagickCmd, [
		"-density", "72",
		`${pdfPath}[0]`,
		"-background", "white",
		"-alpha", "remove",
		"png:-"
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
