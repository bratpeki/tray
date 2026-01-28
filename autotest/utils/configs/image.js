
import { calculateOutPath } from "../functions/calculateOutPath.js"

// Sizes
// TODO: Remove lpadmincode when we don't need lpadmin anymore; qzind/tray/issues/1409
// ORGINAL: const a4 = { size: { width: 210, height: 297 }, units: "mm" }
const us_letter = { conf: { size: { width: 8.5, height: 11  }, units: "in" }, lpadmincode: "Letter" } ;
const a4        = { conf: { size: { width: 210, height: 297 }, units: "mm" }, lpadmincode: "A4" };

// Common amongst all items
const usual = us_letter;

const outPath = calculateOutPath();

const configsImage = [

	{
		name: "IMAGE: Vector, base",
		options: {
			...usual
		},
		outputPath: [outPath, "img", "vector", "basic.pdf"],
	},

	{
		name: "IMAGE: Raster, base",
		options: {
			...usual,
			rasterize: true
		},
		outputPath: [outPath, "img", "raster", "basic.pdf"],
	},

	{
		name: "IMAGE: Vector, rotated 45 degrees",
		options: {
			...usual,
			rotation: 45
		},
		outputPath: [outPath, "img", "vector", "rot45.pdf"],
	},

	{
		name: "IMAGE: Raster, rotated 45 degrees",
		options: {
			...usual,
			rasterize: true,
			rotation: 45
		},
		outputPath: [outPath, "img", "raster", "rot45.pdf"],
	},

	{
		name: "IMAGE: Vector, orientation:reverse-landscape",
		options: {
			...usual,
			orientation: "reverse-landscape"
		},
		outputPath: [outPath, "img", "vector", "orient_revland.pdf"],
	},

	{
		name: "IMAGE: Raster, orientation:reverse-landscape",
		options: {
			...usual,
			rasterize: true,
			orientation: "reverse-landscape"
		},
		outputPath: [outPath, "img", "raster", "orient_revland.pdf"],
	},

	{
		name: "IMAGE: Vector, orientation:landscape",
		options: {
			...usual,
			orientation: "landscape"
		},
		outputPath: [outPath, "img", "vector", "orient_land.pdf"],
	},

	{
		name: "IMAGE: Raster, orientation:landscape",
		options: {
			...usual,
			rasterize: true,
			orientation: "landscape"
		},
		outputPath: [outPath, "img", "raster", "orient_land.pdf"],
	},

	{
		name: "IMAGE: Vector, uniform margin",
		options: {
			...usual,
			margins: 2
		},
		outputPath: [outPath, "img", "vector", "margin_all.pdf"],
	},

	{
		name: "IMAGE: Raster, uniform margin",
		options: {
			...usual,
			rasterize: true,
			margins: 2
		},
		outputPath: [outPath, "img", "raster", "margin_all.pdf"],
	},

	{
		name: "IMAGE: Vector, top and left margin",
		options: {
			...usual,
			margins: { top: 2, left: 2 }
		},
		outputPath: [outPath, "img", "vector", "margin_top_left.pdf"],
	},

	{
		name: "IMAGE: Raster, top and left margin",
		options: {
			...usual,
			rasterize: true,
			margins: { top: 2, left: 2 }
		},
		outputPath: [outPath, "img", "raster", "margin_top_left.pdf"],
	},

	{
		name: "IMAGE: Vector, size (A4)",
		options: {
			...a4
		},
		outputPath: [outPath, "img", "vector", "size_a4.pdf"],
	},

	{
		name: "IMAGE: Raster, size (A4)",
		options: {
			...a4,
			rasterize: true
		},
		outputPath: [outPath, "img", "raster", "size_a4.pdf"],
	},

];

export { configsImage };

