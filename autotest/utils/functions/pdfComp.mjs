
import { rgbaComp } from "./rgbaComp.mjs";
import { pdf2rgba } from "./pdf2rgba.mjs";

// Compares two PDFs and returns if they are the same
//
// Returns a boolean if they're the same (true = same, false = different)
// Currently return false if it runs into an error
//
// NOTE: I'm considering an enum-like idea with 0/1 being results of the check and 2 being an error return value

export async function pdfComp( path1, path2, makeDiff = false ) {

	try {
		const img1 = await pdf2rgba(path1);
		const img2 = await pdf2rgba(path2);
		return await rgbaComp(img1, img2, makeDiff);
	} catch (err) {
		console.error("ERROR (pdfComp): " + err.message);
		return false;
	}

}

