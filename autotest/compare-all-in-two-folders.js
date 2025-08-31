
import fs from "fs/promises";
import path from "path";
import util from "util";

import { pdfComp } from "./utils/functions/pdfComp.mjs"

// Returns a list of strings containing paths to each and every file in the folder
// Recursively searches
async function traverse(dir, result = []) {

	const files = await fs.readdir(dir);

	for (const file of files) {
		const fPath = path.resolve(dir, file);
		const stat = await fs.stat(fPath);
		if (stat.isDirectory()) {
			await traverse(fPath, result);
		} else {
			result.push(fPath);
		}
	}

}

async function comparePdfsInFolders(baseline, latest) {

	var waserr = false;

	var baselineFiles = []; await traverse(baseline, baselineFiles);
	var latestFiles = []; await traverse(latest, latestFiles);

	// if ( baselineFiles.length != latestFiles.length ) throw new Error("Not the same number of files!");

	for (const baselineFile of baselineFiles) {

		const baselineResolve = path.resolve(baseline);
		const baselineRelative = path.relative(baselineResolve, baselineFile);

		const latestResolve = path.resolve(latest);
		const latestCraftedPath = path.join(latestResolve, baselineRelative);

		try {
			await fs.stat(latestCraftedPath);
		} catch {
			console.log(`File ${latestCraftedPath} doesn't exist`);
			waserr = true;
			continue;
		}

		console.log("Comparing:");
		console.log(`  ${baselineFile}`);
		console.log(`  ${latestCraftedPath}`);
		const pdfCompRes = await pdfComp(baselineFile, latestCraftedPath);
		if ( pdfCompRes === false ) {
			console.log(`File ${latestCraftedPath} doesn't match`);
			waserr = true;
		}
		console.log("");

	}

	if (!waserr) console.log("All OK");

}

await comparePdfsInFolders("baseline", "other");

