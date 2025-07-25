
import os from "os";

// Sizes
const us_letter = { size: { width: 8.5, height: 11 }, units: "in" };
const a4 = { size: { width: 210, height: 297 }, units: "mm" };

// Common amongst all items
const usual = us_letter;

let outPath = "";

switch ( os.platform() ) {

	case "win32":
		outPath = ""; // TODO
		break;

	case "linux":
		outPath = "linux_cupspdfs";
		break;

	case "darwin":
		outPath = "macos_pdfwriter";
		break;

}

const pdfConfigs = [

	{
		name: "Vector, base",
		options: {
			...usual
		},
		outputPath: [outPath, "vector", "basic.pdf"],
	},

	{
		name: "Raster, base",
		options: {
			...usual,
			rasterize: true
		},
		outputPath: [outPath, "raster", "basic.pdf"],
	},

	{
		name: "Vector, rotated 45 degrees",
		options: {
			...usual,
			rotation: 45
		},
		outputPath: [outPath, "vector", "rot45.pdf"],
	},

	{
		name: "Raster, rotated 45 degrees",
		options: {
			...usual,
			rasterize: true,
			rotation: 45
		},
		outputPath: [outPath, "raster", "rot45.pdf"],
	},

	{
		name: "Vector, orientation:reverse-landscape",
		options: {
			...usual,
			orientation: "reverse-landscape"
		},
		outputPath: [outPath, "vector", "orient_revland.pdf"],
	},

	{
		name: "Vector, orientation:landscape",
		options: {
			...usual,
			orientation: "landscape"
		},
		outputPath: [outPath, "vector", "orient_land.pdf"],
	},

	{
		name: "Raster, orientation:reverse-landscape",
		options: {
			...usual,
			rasterize: true,
			orientation: "reverse-landscape"
		},
		outputPath: [outPath, "raster", "orient_revland.pdf"],
	},

	{
		name: "Raster, orientation:landscape",
		options: {
			...usual,
			rasterize: true,
			orientation: "landscape"
		},
		outputPath: [outPath, "raster", "orient_land.pdf"],
	},

	{
		name: "Vector, uniform margin",
		options: {
			...usual,
			margins: 2
		},
		outputPath: [outPath, "vector", "margin_all.pdf"],
	},

	{
		name: "Raster, uniform margin",
		options: {
			...usual,
			rasterize: true,
			margins: 2
		},
		outputPath: [outPath, "raster", "margin_all.pdf"],
	},

	{
		name: "Vector, top and left margin",
		options: {
			...usual,
			margins: { top: 2, left: 2 }
		},
		outputPath: [outPath, "vector", "margin_top_left.pdf"],
	},

	{
		name: "Raster, top and left margin",
		options: {
			...usual,
			rasterize: true,
			margins: { top: 2, left: 2 }
		},
		outputPath: [outPath, "raster", "margin_top_left.pdf"],
	},

	{
		name: "Vector, size (A4)",
		options: {
			...a4
		},
		outputPath: [outPath, "vector", "size_a4.pdf"],
	},

	{
		name: "Raster, size (A4)",
		options: {
			...a4,
			rasterize: true
		},
		outputPath: [outPath, "raster", "size_a4.pdf"],
	},

];

export { pdfConfigs };

