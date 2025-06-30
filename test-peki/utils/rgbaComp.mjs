
import pixelmatch from "pixelmatch";

// If we need the diff image:
//
// import { PNG } from "pngjs";
// import fs from "fs";

export async function rgbaComp(img1, img2) {

	try {

		// Pixelmatch doesn't check this, so it's up to us
		if (img1.width !== img2.width || img1.height !== img2.height) {
			throw new Error(
				"Images have different dimensions (" +
				img1.width.toString() + "x" + img1.height.toString() +
				" and " +
				img2.width.toString() + "x" + img2.height.toString() +
				")"
			);
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

		// If we want the output diff as a PNG:
		//
		// const {width, height} = img1;
		// const diff = new PNG({width, height});
		// diff.data = diffBuffer;
		// fs.writeFileSync('diff.png', PNG.sync.write(diff));

		return numDiffPixels === 0;

	}

	catch (err) {
		console.error("ERROR (rgbaComp): ", err);
		throw err; // Pass it along, so the code doesn't keep running
	}

}

