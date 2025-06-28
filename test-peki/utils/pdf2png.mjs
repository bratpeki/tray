import fs from "fs";
import path from "path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

// External resource URLs
const CMAP_URL = "../node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;
const STANDARD_FONT_DATA_URL = "../node_modules/pdfjs-dist/standard_fonts/";

// Main function to load PDF and convert first page to PNG
export async function pdf2png(pdfPath, outputImagePath) {

	try {

		const data = new Uint8Array(fs.readFileSync(pdfPath));

		const loadingTask = getDocument({
			data,
			cMapUrl: CMAP_URL,
			cMapPacked: CMAP_PACKED,
			standardFontDataUrl: STANDARD_FONT_DATA_URL,
		});

		const pdfDocument = await loadingTask.promise;
		console.log("# PDF document loaded.");

		const page = await pdfDocument.getPage(1);
		const canvasFactory = pdfDocument.canvasFactory;
		const viewport = page.getViewport({ scale: 1.0 });

		const canvasAndContext = canvasFactory.create(
			viewport.width,
			viewport.height
		);

		const renderContext = {
			canvasContext: canvasAndContext.context,
			viewport,
		};

		const renderTask = page.render(renderContext);
		await renderTask.promise;

		const image = canvasAndContext.canvas.toBuffer("image/png");
		fs.writeFileSync(outputImagePath, image);
		console.log(`Image written to ${outputImagePath}`);

		page.cleanup();

	} catch (err) { console.error("Failed to process PDF:", err); }

}

// await pdf2png("../assets/rot.pdf", "rot.png");
// await pdf2png("../assets/norot.pdf", "norot.png");
