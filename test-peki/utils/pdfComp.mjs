
import { rgbaComp } from "./rgbaComp.mjs";
import { pdf2rgba } from "./pdf2rgba.mjs";

export async function pdfComp(path1, path2) {

	const img1 = await pdf2rgba(path1);
	const img2 = await pdf2rgba(path2);

	return await rgbaComp(img1, img2);

}

