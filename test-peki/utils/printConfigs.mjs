
// Common amongst all items
const usual = { size: { width: 8.5, height: 11 }, units: "in" }

const printConfigs = [

	{
		name: "Vector, base",
		options: {
			...usual
		},
		outputPath: ["linux_cupspdf", "vector", "basic.pdf"],
	},

	{
		name: "Raster, base",
		options: {
			...usual,
			rasterize: true
		},
		outputPath: ["linux_cupspdf", "raster", "basic.pdf"],
	},

	{
		name: "Vector, rotated 45 degrees",
		options: {
			...usual,
			rotation: 45
		},
		outputPath: ["linux_cupspdf", "vector", "rot45.pdf"],
	},

	{
		name: "Raster, rotated 45 degrees",
		options: {
			...usual,
			rasterize: true,
			rotation: 45
		},
		outputPath: ["linux_cupspdf", "raster", "rot45.pdf"],
	},

	{
		name: "Vector, orientation:reverse-landscape",
		options: {
			...usual,
			orientation: "reverse-landscape"
		},
		outputPath: ["linux_cupspdf", "vector", "orient_revland.pdf"],
	},

	{
		name: "Vector, orientation:landscape",
		options: {
			...usual,
			orientation: "landscape"
		},
		outputPath: ["linux_cupspdf", "vector", "orient_land.pdf"],
	},

	{
		name: "Raster, orientation:reverse-landscape",
		options: {
			...usual,
			rasterize: true,
			orientation: "reverse-landscape"
		},
		outputPath: ["linux_cupspdf", "raster", "orient_revland.pdf"],
	},

	{
		name: "Raster, orientation:landscape",
		options: {
			...usual,
			rasterize: true,
			orientation: "landscape"
		},
		outputPath: ["linux_cupspdf", "raster", "orient_land.pdf"],
	},

	{
		name: "Vector, uniform margin",
		options: {
			...usual,
			margins: 2
		},
		outputPath: ["linux_cupspdf", "vector", "margin_all.pdf"],
	},

	{
		name: "Raster, uniform margin",
		options: {
			...usual,
			rasterize: true,
			margins: 2
		},
		outputPath: ["linux_cupspdf", "raster", "margin_all.pdf"],
	},

	{
		name: "Vector, top and left margin",
		options: {
			...usual,
			margins: { top: 2, left: 2 }
		},
		outputPath: ["linux_cupspdf", "vector", "margin_top_left.pdf"],
	},

	{
		name: "Raster, top and left margin",
		options: {
			...usual,
			rasterize: true,
			margins: { top: 2, left: 2 }
		},
		outputPath: ["linux_cupspdf", "raster", "margin_top_left.pdf"],
	},

];

export { printConfigs };

