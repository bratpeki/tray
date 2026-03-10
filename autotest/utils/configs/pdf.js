
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
		options: {
			...usual.conf,
			jobName: "PDF Vector Base"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "vector", "basic.pdf"],
	},

	{
		options: {
			...usual.conf,
			rasterize: true,
			jobName: "PDF Raster Base"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "raster", "basic.pdf"],
	},

	{
		options: {
			...usual.conf,
			rotation: 45,
			jobName: "PDF Vector Rot45"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "vector", "rot45.pdf"],
	},

	{
		options: {
			...usual.conf,
			rasterize: true,
			rotation: 45,
			jobName: "PDF Raster Rot45"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "raster", "rot45.pdf"],
	},

	{
		options: {
			...usual.conf,
			orientation: "reverse-landscape",
			jobName: "PDF Vector Orientation reverse-landscape"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "vector", "orient_revland.pdf"],
	},

	{
		options: {
			...usual.conf,
			rasterize: true,
			orientation: "reverse-landscape",
			jobName: "PDF Raster Orientation reverse-landscape"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "raster", "orient_revland.pdf"],
	},

	{
		options: {
			...usual.conf,
			orientation: "landscape",
			jobName: "PDF Vector Orientation landscape"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "vector", "orient_land.pdf"],
	},

	{
		options: {
			...usual.conf,
			rasterize: true,
			orientation: "landscape",
			jobName: "PDF Raster Orientation landscape"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "raster", "orient_land.pdf"],
	},

	{
		options: {
			...usual.conf,
			margins: 2,
			jobName: "PDF Vector Margin uniform"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "vector", "margin_all.pdf"],
	},

	{
		options: {
			...usual.conf,
			rasterize: true,
			margins: 2,
			jobName: "PDF Raster Margin uniform"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "raster", "margin_all.pdf"],
	},

	{
		options: {
			...usual.conf,
			margins: { top: 2, left: 2 },
			jobName: "PDF Vector Margin top left"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "vector", "margin_top_left.pdf"],
	},

	{
		options: {
			...usual.conf,
			rasterize: true,
			margins: { top: 2, left: 2 },
			jobName: "PDF Raster Margin top left"
		},
		lpadmincode: usual.lpadmincode,
		outputPath: [outPath, "pdf", "raster", "margin_top_left.pdf"],
	},

	{
		options: {
			...a4.conf,
			jobName: "PDF Vector A4"
		},
		lpadmincode: a4.lpadmincode,
		outputPath: [outPath, "pdf", "vector", "size_a4.pdf"],
	},

	{
		options: {
			...a4.conf,
			rasterize: true,
			jobName: "PDF Raster A4"
		},
		lpadmincode: a4.lpadmincode,
		outputPath: [outPath, "pdf", "raster", "size_a4.pdf"],
	},

];

export { configsPdf };

