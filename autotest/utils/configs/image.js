
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
		options: {
			...usual.conf,
			jobName: "IMAGE Vector Base"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "img", "vector", "basic.pdf"],
	},

	{
		options: {
			...usual.conf,
			rasterize: true,
			jobName: "IMAGE Raster Base"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "img", "raster", "basic.pdf"],
	},

	{
		options: {
			...usual.conf,
			rotation: 45,
			jobName: "IMAGE Vector Rot45"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "img", "vector", "rot45.pdf"],
	},

	{
		options: {
			...usual.conf,
			rasterize: true,
			rotation: 45,
			jobName: "IMAGE Raster Rot45"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "img", "raster", "rot45.pdf"],
	},

	{
		options: {
			...usual.conf,
			orientation: "reverse-landscape",
			jobName: "IMAGE Vector Orientation reverse-landscape"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "img", "vector", "orient_revland.pdf"],
	},

	{
		options: {
			...usual.conf,
			rasterize: true,
			orientation: "reverse-landscape",
			jobName: "IMAGE Raster Orientation reverse-landscape"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "img", "raster", "orient_revland.pdf"],
	},

	{
		options: {
			...usual.conf,
			orientation: "landscape",
			jobName: "IMAGE Vector Orientation landscape"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "img", "vector", "orient_land.pdf"],
	},

	{
		options: {
			...usual.conf,
			rasterize: true,
			orientation: "landscape",
			jobName: "IMAGE Raster Orientation landscape"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "img", "raster", "orient_land.pdf"],
	},

	{
		options: {
			...usual.conf,
			margins: 2,
			jobName: "IMAGE Vector Margin uniform"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "img", "vector", "margin_all.pdf"],
	},

	{
		options: {
			...usual.conf,
			rasterize: true,
			margins: 2,
			jobName: "IMAGE Raster Margin uniform"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "img", "raster", "margin_all.pdf"],
	},

	{
		options: {
			...usual.conf,
			margins: { top: 2, left: 2 },
			jobName: "IMAGE Vector Margin top left"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "img", "vector", "margin_top_left.pdf"],
	},

	{
		options: {
			...usual.conf,
			rasterize: true,
			margins: { top: 2, left: 2 },
			jobName: "IMAGE Raster Margin top left"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "img", "raster", "margin_top_left.pdf"],
	},

	{
		options: {
			...a4.conf,
			jobName: "IMAGE Vector A4"
		},
		lpadmincode: a4.lpadmincode,
		outputPath: [outPath, "img", "vector", "size_a4.pdf"],
	},

	{
		options: {
			...a4.conf,
			rasterize: true,
			jobName: "IMAGE Raster A4"
		},
		lpadmincode: a4.lpadmincode,
		outputPath: [outPath, "img", "raster", "size_a4.pdf"],
	},

];

export { configsImage };

