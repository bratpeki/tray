
import { calculateOutPath } from "../functions/calculateOutPath.js"

// Sizes
// TODO: Remove lpadmincode when we don't need lpadmin anymore; qzind/tray/issues/1409
// ORGINAL: const a4 = { size: { width: 210, height: 297 }, units: "mm" }
const us_letter = { conf: { size: { width: 8.5, height: 11  }, units: "in" }, lpadmincode: "Letter" } ;
const a4        = { conf: { size: { width: 210, height: 297 }, units: "mm" }, lpadmincode: "A4" };

// Common amongst all config items
const usual = us_letter;

const outPath = calculateOutPath();

const configsHtml = [

	{
		name: "HTML: Vector, base",
		options: {
			...usual.conf
		},
		outputPath: [outPath, "html", "vector", "basic.pdf"],
	},

	{
		name: "HTML: Raster, base",
		options: {
			...usual.conf,
			rasterize: true
		},
		outputPath: [outPath, "html", "raster", "basic.pdf"],
	},

	// Skipping vector and rotation: https://github.com/qzind/tray/issues/529
	/*
	{
		name: "HTML: Vector, rotated 45 degrees",
		options: {
			...usual.conf,
			rotation: 45
		},
		outputPath: [outPath, "html", "vector", "rot45.pdf"],
	},
	*/

	{
		name: "HTML: Raster, rotated 45 degrees",
		options: {
			...usual.conf,
			rasterize: true,
			rotation: 45
		},
		outputPath: [outPath, "html", "raster", "rot45.pdf"],
	},

	{
		name: "HTML: Vector, orientation:reverse-landscape",
		options: {
			...usual.conf,
			orientation: "reverse-landscape"
		},
		outputPath: [outPath, "html", "vector", "orient_revland.pdf"],
	},

	{
		name: "HTML: Raster, orientation:reverse-landscape",
		options: {
			...usual.conf,
			rasterize: true,
			orientation: "reverse-landscape"
		},
		outputPath: [outPath, "html", "raster", "orient_revland.pdf"],
	},

	{
		name: "HTML: Vector, orientation:landscape",
		options: {
			...usual.conf,
			orientation: "landscape"
		},
		outputPath: [outPath, "html", "vector", "orient_land.pdf"],
	},

	{
		name: "HTML: Raster, orientation:landscape",
		options: {
			...usual.conf,
			rasterize: true,
			orientation: "landscape"
		},
		outputPath: [outPath, "html", "raster", "orient_land.pdf"],
	},

	{
		name: "HTML: Vector, uniform margin",
		options: {
			...usual.conf,
			margins: 2
		},
		outputPath: [outPath, "html", "vector", "margin_all.pdf"],
	},

	{
		name: "HTML: Raster, uniform margin",
		options: {
			...usual.conf,
			rasterize: true,
			margins: 2
		},
		outputPath: [outPath, "html", "raster", "margin_all.pdf"],
	},

	{
		name: "HTML: Vector, top and left margin",
		options: {
			...usual.conf,
			margins: { top: 2, left: 2 }
		},
		outputPath: [outPath, "html", "vector", "margin_top_left.pdf"],
	},

	{
		name: "HTML: Raster, top and left margin",
		options: {
			...usual.conf,
			rasterize: true,
			margins: { top: 2, left: 2 }
		},
		outputPath: [outPath, "html", "raster", "margin_top_left.pdf"],
	},

	{
		name: "HTML: Vector, size (A4)",
		options: {
			...a4.conf
		},
		outputPath: [outPath, "html", "vector", "size_a4.pdf"],
	},

	{
		name: "HTML: Raster, size (A4)",
		options: {
			...a4.conf,
			rasterize: true
		},
		outputPath: [outPath, "html", "raster", "size_a4.pdf"],
	},

];

export { configsHtml };

