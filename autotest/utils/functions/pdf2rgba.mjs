
// This module export pdf2rgba
//
// Converts PDF files on 'pdfPath' to a pixel buffer
// The output is a buffer array of size W*H*4, each pixel needs 4 bytes for RGBA values
//
// So, the format of the output is a dict with the format {data, width, height}
// "data" is a Uint8Array with the format [ R,G,B,A, R,G,B,A, R,G,B,A, ... ]
//
// pdfPath - The path to the PDF file we want to generate the RGBA buffer of

import fs from "fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

// External resource URLs
const CMAP_URL = "../../node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;
const STANDARD_FONT_DATA_URL = "../../node_modules/pdfjs-dist/standard_fonts/";

export async function pdf2rgba(pdfPath) {

	// Raw PDF file data
	const data = new Uint8Array(await fs.readFile(pdfPath));

	// https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html
	//
	// 'getDocument' returns an object of type 'PDFDocumentLoadingTask'
	const loadingTask = getDocument({
		data,
		cMapUrl: CMAP_URL,
		cMapPacked: CMAP_PACKED,
		standardFontDataUrl: STANDARD_FONT_DATA_URL,
	});

	// Once the promise of 'PDFDocumentLoadingTask' is resolved, it returns an object of type 'PDFDocumentProxy'
	const pdfDocument = await loadingTask.promise;

	// You can then run 'getPage' on that 'PDFDocumentProxy' object
	const page = await pdfDocument.getPage(1);

	// pdf.js provides a canvas factory for us
	//
	// $ grep NodeCanvasFactory -r .
	// ./pdf.mjs:class NodeCanvasFactory extends BaseCanvasFactory {
	// ./pdf.mjs:  const CanvasFactory = src.CanvasFactory || (isNodeJS ? NodeCanvasFactory : DOMCanvasFactory);
	// ...
	//
	// A canvas factory is used to create and manage canvases in a platform-independent way.
	// We basically only need it for the 'create' method, which
	// returns a canvas and its 2D context, sized to the given width and height.
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

	const imageData = canvasAndContext.context.getImageData(
		0,
		0,
		viewport.width,
		viewport.height
	);

	page.cleanup();

	return {
		data: imageData.data, // The RGBA pixels, exactly what we're here for!
		width: viewport.width, // An int
		height: viewport.height // Another int
	};

}

