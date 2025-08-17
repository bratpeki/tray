
import qz from "../js/qz-tray.js";

///////////////////////////////////////////////////////////////////////////

function truncate( number, decimalPlaces ) {
	return Math.trunc( number * Math.pow(10, decimalPlaces) ) / Math.pow(10, decimalPlaces);
}

///////////////////////////////////////////////////////////////////////////

( async () => {

	await qz.websocket.connect();

	const found = await qz.printers.getDefault();

	var data = await qz.printers.details();
	// includes returns the first item that satisfies the condition
	// maybe filter is more fitting
	data = data.find( (p) => p.name.toLowerCase().includes("pdf") );

	data.sizes.forEach( (s) => {
		console.log( `${s.name} (in) : w=${truncate(s.in.width, 2)}, h=${truncate(s.in.height, 2)}` );
		console.log( `${s.name} (mm) : w=${truncate(s.mm.width, 2)}, h=${truncate(s.mm.height, 2)}` );
	} );

	await qz.websocket.disconnect();

	process.exit(0);

} )();

