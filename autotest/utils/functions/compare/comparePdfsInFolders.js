
// comparePdfsInFolders.js

import * as fs from 'node:fs';
import path from 'node:path';

import * as format from "../format/formatOutput.js";
import { pdfComp } from "./pdfComp.js"

// Traverses dir recursively and stores all the file paths into result.
function traverse(dir, result = []) {

	const files = fs.readdirSync(dir);

	for (const file of files) {
		const fPath = path.resolve(dir, file);
		const stat = fs.statSync(fPath);
		if (stat.isDirectory()) {
			traverse(fPath, result);
		} else {
			result.push(fPath);
		}
	}

}

// Compares PDFs in of the baseline and latest folder paths and prints the result.
// The result is either "All OK" or "Not OK".
export async function comparePdfsInFolders(baseline, latest) {

	// Delete previous diffs.
	fs.rmSync("diff", { recursive: true, force: true })
	fs.mkdirSync("diff");

	if (!(fs.existsSync(baseline))) {
		format.fail(`${baseline} (baseline) does not exist.`);
		return 1;
	}

	if (!(fs.existsSync(latest))) {
		format.fail(`${latest} (latest) does not exist.`);
		return 1;
	}

	// Tracks if there was an error and all the errors.
	// errarr contains pairs of the path and the error message.
	var waserr = false;
	var errarr = []

	var baselineFiles = []; traverse(baseline, baselineFiles);
	var latestFiles = []; traverse(latest, latestFiles);

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
			format.info(`Skipping ${latestFile}`);
			console.log("");
			continue;
		}

		// The baseline PDF has to exist.
		// We could probably omit this but I went on the side of caution.
		try { fs.statSync(baselineCraftedPath); }
		catch {
			format.fail(`File ${baselineCraftedPath} doesn't exist`);
			console.log("");
			waserr = true;
			errarr.push( [ latestRelative, "Corresponding file doesn't exist"] );
			continue;
		}

		try {

			// We make the DIFF and put it in the diff folder.
			// The filename is the last 4 path sections, for example:
			// macos-pdfwriter + html + raster + rot45
			const pdfCompRes = await pdfComp(
				latestFile, baselineCraftedPath,
				true,
				"diff" + path.sep + latestFile.split(path.sep).slice(-4).join("-").replace(".pdf", ".png")
			);

			if ( pdfCompRes === false ) {
				format.fail(`${latestRelative}: Content doesn't match`);
				waserr = true;
				errarr.push( [ latestRelative, "Content doesn't match" ] );
			}
			else {
				format.pass(`${latestRelative}: Success`);
			}

		}

		catch (err) {
			format.fail(`${latestRelative}: ${err.message}`);
			waserr = true;
			errarr.push( [ latestRelative, err.message ] );
		}

	}

	format.divider( waserr ? "Not OK" : "All OK" );

	console.log("");

	if (errarr.length > 0) {
		const tableData = errarr.map(([file, message]) => ({ File: file, Error: message }));
		console.table(tableData);
		// Ensure the logs hit the screen before we die
		await new Promise(resolve => process.stdout.write('', resolve));
		return 1;
	}

	return 0;

}

