
import { pdf2pixels } from "./pdf2pixels.mjs";
import pixelmatch from "pixelmatch";

export async function pixelsComp(path1, path2) {

	try {

		const img1 = await pdf2pixels(path1);
		const img2 = await pdf2pixels(path2);

		// Pixelmatch doesn't check this, so it's up to us
		if (img1.width !== img2.width || img1.height !== img2.height) {
			throw new Error("Images have different dimensions");
		}

		const diffBuffer = new Uint8ClampedArray(img1.width * img1.height * 4);

		// https://github.com/mapbox/pixelmatch?tab=readme-ov-file#api
		const numDiffPixels = pixelmatch(
			img1.data,
			img2.data,
			diffBuffer,
			img1.width,
			img1.height,
			{ threshold: 0.1 }
		);

		return numDiffPixels === 0;

	}
	catch (error) { throw error; }

}

