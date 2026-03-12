
// rgbaComp.js

import fs from "node:fs";

import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

// Compares two RGBA buffers made with pdf2rgba (img1 and img2).
//
// makeDiff toggles DIFF image generation and stores it in diffLocation.
// threshold is how many erroneous pixels we allow, in %. By default it's 0.1%.
// Returns true if the error is less than the threshold.
export function rgbaComp( img1, img2, makeDiff = false, diffLocation = "", threshold = 0.1 ) {

	// Pixelmatch doesn't check this, so it's up to us
	if (img1.width !== img2.width || img1.height !== img2.height) {
		throw new Error(`Images have different dimensions (${img1.width}x${img1.height} and ${img2.width}x${img2.height})`);
	}

	// RGBA buffer, four bytes per pixel
	const diffBuffer = new Uint8ClampedArray(img1.width * img1.height * 4);

	// We know the return value based on:
	// https://github.com/mapbox/pixelmatch/blob/main/index.js#L100
	const numDiffPixels = pixelmatch(
		img1.data,
		img2.data,
		diffBuffer,
		img1.width,
		img1.height,
		{ threshold: 0.1 }
	);

	const allowedRed = Math.round(img1.data.length * threshold * 0.01);
	const underTheThresh = (numDiffPixels < allowedRed);

	// If we want the diff, it has to be a PNG
	if ( !underTheThresh && makeDiff && diffLocation.endsWith(".png") ) {
		const {width, height} = img1;
		const diff = new PNG({width, height});
		diff.data = diffBuffer;
		fs.writeFileSync(diffLocation, PNG.sync.write(diff));
	}

	console.log("  (total, allowed error, true error) =", [img1.data.length, allowedRed, numDiffPixels])

	return underTheThresh;

}
