
import { pdf2pixels } from "./pdf2pixels.mjs";

import pixelmatch from "pixelmatch";

import { PNG } from "pngjs";
import fs from "fs";

export async function pixelsComp(path1, path2) {

	try {

		const img1 = await pdf2pixels(path1);
		const img2 = await pdf2pixels(path2);

		// Pixelmatch doesn't check this, so it's up to us
		if (img1.width !== img2.width || img1.height !== img2.height) {
			throw new Error("Images have different dimensions");
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

		// If we want the output generated
		//
		// const {width, height} = img1;
		// const diff = new PNG({width, height});
		// diff.data = diffBuffer;
		// fs.writeFileSync('diff.png', PNG.sync.write(diff));

		return numDiffPixels === 0;

	}
	catch (error) { throw error; }

}

