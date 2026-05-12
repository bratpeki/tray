
// createDirectoryTree.js

import { promises as fs } from "node:fs";
import * as path from "node:path";

// Levels to the directory tree.
// Every lvl1 directory has every lvl2 directory.
// Every lvl2 directory has every lvl3 directory.
const lvl1 = [ "linux_cupspdf", "macos_pdfwriter", "windows_bullzip" ]
const lvl2 = [ "pdf", "img", "html" ]
const lvl3 = [ "vector", "raster" ]

// Generates the empty PDF directory tree with baseFolder being the root.
// fs.mkdir doesn't fail if the folder already exists.
export async function createDirectoryTree(baseFolder) {

	let directoriesToCreate = [];

	directoriesToCreate.push(baseFolder);

	lvl1.forEach(l1 => {
		directoriesToCreate.push(path.join(baseFolder, l1));
		lvl2.forEach(l2 => {
			directoriesToCreate.push(path.join(baseFolder, l1, l2));
			lvl3.forEach(l3 => {
				if (l2 === "img" && l3 === "vector") { return; }
				directoriesToCreate.push(path.join(baseFolder, l1, l2, l3));
			})
		})
	});

	for (const dirPath of directoriesToCreate) {
		await fs.mkdir(dirPath, { recursive: true });
	}

}

