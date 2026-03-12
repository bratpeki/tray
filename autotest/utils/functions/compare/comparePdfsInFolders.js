
// comparePdfsInFolders.js

// TODO: Can this be under promises 100%?
import { promises as fs } from "node:fs";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import path from "path";

import { calculateDelim } from "../split/calculateDelim.js"
import { pdfComp } from "./pdfComp.js"

// Traverses dir recursively and stores all the file paths into result.
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

// Compares PDFs in of the baseline and latest folder paths and prints the result.
// The result is either "All OK" or "Not OK".
export async function comparePdfsInFolders(baseline, latest) {

	// Delete previous diffs.
	rmSync("diff", { recursive: true, force: true })
	mkdirSync("diff");

	if (!(existsSync(baseline))) {
		console.error(`${baseline} (baseline) does not exist.`);
		return 1;
	}

	if (!(existsSync(latest))) {
		console.error(`${latest} (latest) does not exist.`);
		return 1;
	}

	// Tracks if there was an error and all the errors.
	// errarr contains pairs of the path and the error message.
	var waserr = false;
	var errarr = []

	var baselineFiles = []; await traverse(baseline, baselineFiles);
	var latestFiles = []; await traverse(latest, latestFiles);

	for (const latestFile of latestFiles) {

		// Added specifically because I got ".DS_Store"
		// when generating stuff and it got very annoying lol
		const ext = path.extname(latestFile);

		const latestResolve = path.resolve(latest);
		const latestRelative = path.relative(latestResolve, latestFile);

		// We construct the path to the baseline by piecing together
		// baselineResolve and latestRelative.
		const baselineResolve = path.resolve(baseline);
		const baselineCraftedPath = path.join(baselineResolve, latestRelative);

		// The extension can only be ".pdf"
		if ( ext.toLowerCase() != ".pdf" ) {
			console.log(`Skipping ${latestFile}`);
			console.log("");
			continue;
		}

		// The baseline PDF has to exist.
		// We could probably omit this but I went on the side of caution.
		try { await fs.stat(baselineCraftedPath); }
		catch {
			console.log(`File ${baselineCraftedPath} doesn't exist`);
			console.log("");
			waserr = true;
			errarr.push( [ latestRelative, "Corresponding file doesn't exist"] );
			continue;
		}

		console.log("Comparing:");
		console.log(`  ${latestFile}`);
		console.log(`  ${baselineCraftedPath}`);

		try {

			// We make the DIFF and put it in the diff folder.
			// The filename is the last 4 path sections, for example:
			// macos-pdfwriter + html + raster + rot45
			const pdfCompRes = await pdfComp(
				latestFile, baselineCraftedPath,
				true,
				"diff" + calculateDelim() + latestFile.split(calculateDelim()).slice(-4).join("-").replace(".pdf", ".png")
			);

			if ( pdfCompRes === false ) {
				console.log(`  Error: Content doesn't match`);
				waserr = true;
				errarr.push( [ latestRelative, "Failed PDF comparison" ] );
			}
			else {
				console.log(`  Success`);
			}

		}

		catch (err) {
			console.log(`  Error: ${err.message}`);
			waserr = true;
			errarr.push( [ latestRelative, err.message ] );
		}

		console.log("");

	}

	console.log( waserr ? "Not OK" : "All OK" );

	if (errarr.length > 0) {
		const tableData = errarr.map(([file, message]) => ({ File: file, Error: message }));
		console.table(tableData);
		// Ensure the logs hit the screen before we die
		await new Promise(resolve => process.stdout.write('', resolve));
		return 1;
	}

	return 0;

}

