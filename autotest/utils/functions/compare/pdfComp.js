
// pdfComp.js

import { rgbaComp } from "./rgbaComp.js";
import { pdf2rgba } from "./pdf2rgba.js";

// Compares two PDFs by RGBA buffers.
//
// The workflow is:
// path1 -> pdf2rgba \
//                    ---> rgbaComp ---> true/false + diff (if defined)
// path2 -> pdf2rgba /
export async function pdfComp( path1, path2, makeDiff = false, diffLocation = "" ) {
	const img1 = await pdf2rgba(path1);
	const img2 = await pdf2rgba(path2);
	return rgbaComp(img1, img2, makeDiff, diffLocation);
}

