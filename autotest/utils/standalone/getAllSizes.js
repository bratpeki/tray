
// getAllSizes.js

// A standalone tool to get
// all sizes the PDF printer supports
// in both mm and in

import qz from "../../../js/qz-tray.js";

// Turnactes the number to the specified number of decimal places
function truncate( number, decimalPlaces ) {
	return Math.trunc( number * Math.pow(10, decimalPlaces) ) / Math.pow(10, decimalPlaces);
}

( async () => {

	await qz.websocket.connect();

	const data = await qz.printers.details();

	const pdfPrinter = data.find( (p) => p.name.toLowerCase().includes("pdf") );
	if (!pdfPrinter) {
		console.error("No PDF printer found");
		await qz.websocket.disconnect();
		process.exit(1);
	}

	pdfPrinter.sizes.forEach( (s) => {
		console.log(`${s.name}:`);
		console.log(`  in: w=${truncate(s.in.width, 2)}, h=${truncate(s.in.height, 2)}`);
		console.log(`  mm: w=${truncate(s.mm.width, 2)}, h=${truncate(s.mm.height, 2)}`);
	} );

	await qz.websocket.disconnect();

	process.exit(0);

} )();

