
import { exists, promises as fs } from "fs";
import { existsSync } from "fs";
import assert from "node:assert";
import path from "path";

import { pdfComp } from "./utils/functions/pdfComp.js"

// CLI args
const args = process.argv;

// Call it as "node compare-all-in-two-folders.js DIR1 DIR2" or similar
assert(args[0].includes("node"));
assert(args[1].includes("compare-all-in-two-folders"));

let baselinedir;
let latestdir;

if ( args.length < 4 ) {
	console.warn("Please specify both the baseline prints and latest prints directories. Exiting...");
	process.exit(1);
}
else {
	baselinedir = args[2];
	latestdir = args[3];
}

baselinedir = path.resolve(process.cwd(), baselinedir);
baselinedir = path.normalize(baselinedir);

latestdir = path.resolve(process.cwd(), latestdir);
latestdir = path.normalize(latestdir);

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
 * Compares PDF and prints the result.
 * Prints either "All OK" or "Not OK".
 *
 * @async
 *
 * @param {string} baseline - The baseline PDFs (folder)
 * @param {string} latest - The latest printed PDFs (folder)
 */
async function comparePdfsInFolders(baseline, latest) {

	if (!(existsSync(baseline))) {
		console.error(`${baseline} (baseline) does not exist.`);
		return;
	}

	if (!(existsSync(latest))) {
		console.error(`${latest} (latest) does not exist.`);
		return;
	}

	var waserr = false;
	var errarr = []

	var baselineFiles = []; await traverse(baseline, baselineFiles);
	var latestFiles = []; await traverse(latest, latestFiles);

	for (const baselineFile of baselineFiles) {

		// Added specifically because I got ".DS_Store" when generating stuff and it got very annoying lol
		const ext = path.extname(baselineFile);

		const baselineResolve = path.resolve(baseline);
		const baselineRelative = path.relative(baselineResolve, baselineFile);

		const latestResolve = path.resolve(latest);
		const latestCraftedPath = path.join(latestResolve, baselineRelative);

		if ( ext.toLowerCase() != ".pdf" ) {
			console.log(`Skipping ${baselineFile}`);
			errarr.push( [ baselineRelative, "Not a PDF file"] );
			console.log("");
			continue;
		}

		try { await fs.stat(latestCraftedPath); }
		catch {
			console.log(`File ${latestCraftedPath} doesn't exist`);
			console.log("");
			waserr = true;
			errarr.push( [ baselineRelative, "Corresponding file doesn't exist"] );
			continue;
		}

		console.log("Comparing:");
		console.log(`  ${baselineFile}`);
		console.log(`  ${latestCraftedPath}`);

		try {

			const pdfCompRes = await pdfComp(baselineFile, latestCraftedPath);

			if ( pdfCompRes === false ) {
				console.log(`  Error: Content doesn't match`);
				waserr = true;
				errarr.push( [ baselineRelative, "Failed PDF comparison" ] );
			}
			else {
				console.log(`  Success`);
			}

		}

		catch (err) {
			console.log(`  Error: ${err.message}`);
			waserr = true;
			errarr.push( [ baselineRelative, err.message ] );
		}

		console.log("");

	}

	console.log( waserr ? "Not OK" : "All OK" );

	if (errarr.length > 0) {
		console.table(
			errarr.map(([file, message]) => ({ File: file, Error: message }))
		);
	}

}

await comparePdfsInFolders(baselinedir, latestdir);

