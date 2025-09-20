
import { promises as fs } from "fs";
import path from "path";

import { pdfComp } from "./utils/functions/pdfComp.js"

/**
 * Traverses the folder recursively and stores all the file paths into `result`
 *
 * @async
 *
 * @param {string} dir - The directory we're traversing
 * @param {string[]} result - The array we're pushing all the found files to
 */
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

/**
 * A substitute for <code>fs.existsSync</code>
 * that uses <code>async/await</code>.
 *
 * @async
 * @param {string} path - The path we want to verify exists
 *
 * @returns {Promise<boolean>} true if the path exists, false otherwise
 */
async function exists(path) {
	try {
		await fs.access(path);
		return true;
	} catch {
		return false;
	}
}

/**
 * Compares PDF and prints the result.
 * Prints either "All OK" or "Not OK".
 *
 * @async
 *
 * @param {string} baseline - The baseline PDFs (folder)
 * @param {string} latest - The latest printed PDFs (folder)
 */
async function comparePdfsInFolders(baseline, latest) {

	if (!(await exists(baseline))) {
		console.error(`${baseline} (baseline) does not exist.`);
		return;
	}

	if (!(await exists(latest))) {
		console.error(`${latest} (latest) does not exist.`);
		return;
	}

	var waserr = false;
	var errarr = []

	var baselineFiles = []; await traverse(baseline, baselineFiles);
	var latestFiles = []; await traverse(latest, latestFiles);

	// if ( baselineFiles.length != latestFiles.length ) throw new Error("Not the same number of files!");

	for (const baselineFile of baselineFiles) {

		const baselineResolve = path.resolve(baseline);
		const baselineRelative = path.relative(baselineResolve, baselineFile);

		const latestResolve = path.resolve(latest);
		const latestCraftedPath = path.join(latestResolve, baselineRelative);

		try { await fs.stat(latestCraftedPath); }
		catch {
			console.log(`File ${latestCraftedPath} doesn't exist`);
			waserr = true;
			continue;
		}

		console.log("Comparing:");
		console.log(`  ${baselineFile}`);
		console.log(`  ${latestCraftedPath}`);

		const pdfCompRes = await pdfComp(baselineFile, latestCraftedPath);
		if ( pdfCompRes === false ) {
			console.log(`  Error: Files don't match`);
			errarr.push(baselineRelative)
			waserr = true;
		}
		else {
			console.log(`  Success`);
		}
		console.log("");

	}

	if (!waserr)
		console.log("All OK");

	else {
		console.log("Not OK");
		console.log(errarr);
	}

}

await comparePdfsInFolders("baseline", "other");

