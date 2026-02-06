
import { calculateOutPath } from "../functions/calculateOutPath.js"

// Sizes
// TODO: Remove lpadmincode when we don't need lpadmin anymore; qzind/tray/issues/1409
// ORGINAL: const a4 = { size: { width: 210, height: 297 }, units: "mm" }
const us_letter = { conf: { size: { width: 8.5, height: 11  }, units: "in" }, lpadmincode: "Letter" } ;
const a4        = { conf: { size: { width: 210, height: 297 }, units: "mm" }, lpadmincode: "A4" };

// Common amongst all items
const usual = us_letter;

const outPath = calculateOutPath();

const configsPdf = [

	{
		name: "PDF: Vector, base",
		options: {
			...usual.conf
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "vector", "basic.pdf"],
	},

	{
		name: "PDF: Raster, base",
		options: {
			...usual.conf,
			rasterize: true
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "raster", "basic.pdf"],
	},

	{
		name: "PDF: Vector, rotated 45 degrees",
		options: {
			...usual.conf,
			rotation: 45
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "vector", "rot45.pdf"],
	},

	{
		name: "PDF: Raster, rotated 45 degrees",
		options: {
			...usual.conf,
			rasterize: true,
			rotation: 45
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "raster", "rot45.pdf"],
	},

	{
		name: "PDF: Vector, orientation:reverse-landscape",
		options: {
			...usual.conf,
			orientation: "reverse-landscape"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "vector", "orient_revland.pdf"],
	},

	{
		name: "PDF: Raster, orientation:reverse-landscape",
		options: {
			...usual.conf,
			rasterize: true,
			orientation: "reverse-landscape"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "raster", "orient_revland.pdf"],
	},

	{
		name: "PDF: Vector, orientation:landscape",
		options: {
			...usual.conf,
			orientation: "landscape"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "vector", "orient_land.pdf"],
	},

	{
		name: "PDF: Raster, orientation:landscape",
		options: {
			...usual.conf,
			rasterize: true,
			orientation: "landscape"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "raster", "orient_land.pdf"],
	},

	{
		name: "PDF: Vector, uniform margin",
		options: {
			...usual.conf,
			margins: 2
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "vector", "margin_all.pdf"],
	},

	{
		name: "PDF: Raster, uniform margin",
		options: {
			...usual.conf,
			rasterize: true,
			margins: 2
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "raster", "margin_all.pdf"],
	},

	{
		name: "PDF: Vector, top and left margin",
		options: {
			...usual.conf,
			margins: { top: 2, left: 2 }
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "vector", "margin_top_left.pdf"],
	},

	{
		name: "PDF: Raster, top and left margin",
		options: {
			...usual.conf,
			rasterize: true,
			margins: { top: 2, left: 2 }
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "raster", "margin_top_left.pdf"],
	},

	{
		name: "PDF: Vector, size (A4)",
		options: {
			...a4.conf
		},
		lpadmincode: a4.lpadmincode,
		outputPath: [outPath, "pdf", "vector", "size_a4.pdf"],
	},

	{
		name: "PDF: Raster, size (A4)",
		options: {
			...a4.conf,
			rasterize: true
		},
		lpadmincode: a4.lpadmincode,
		outputPath: [outPath, "pdf", "raster", "size_a4.pdf"],
	},

];

export { configsPdf };

