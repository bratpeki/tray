
import fs from "fs";
import path from "path";
import util from "util";

// Return simple strings of all files in the folder
// Shamelessly copied from https://stackoverflow.com/a/46391945
function traverse(dir, result = []) {

	fs.readdirSync(dir).forEach((file) => {

		const fPath = path.resolve(dir, file);

		if (fs.statSync(fPath).isDirectory()) {
			return traverse(fPath, result)
		}

		result.push(fPath);

	});

	return result;

};

function getPathBits(pth) {
	return path.normalize(pth).split(path.sep).filter(Boolean);
}

async function comparePdfsInFolders(baseline, latest) {

	var baselineFiles = []; traverse(baseline, baselineFiles);
	var latestFiles = []; traverse(latest, latestFiles);

	if ( baselineFiles.length != latestFiles.length )
		throw new Error("Not the same number of files!");

	for ( var i = 0; i < baselineFiles.length; i++ ) {

		const baselineFile = baselineFiles[i];
		const baselineResolve = path.resolve(baseline);
		const baselineRelative = path.relative(baselineResolve, baselineFile);

		const latestFile = latestFiles[i];
		const latestResolve = path.resolve(latest);

		// Okay so... This is what we need:
		// latestResolve + baselineRelative
		const latestCraftedPath = path.join( latestResolve, baselineRelative )

		console.log(`Full path:             ${baselineFile}`);
		console.log(`Just the initial bit:  ${baselineResolve}`);
		console.log(`Relative path:         ${baselineRelative}`);
		console.log(`Crafted path to check: ${latestCraftedPath}`);
		console.log("");
		// console.log(`${}`);
	};

}

await comparePdfsInFolders("baseline", "other");

