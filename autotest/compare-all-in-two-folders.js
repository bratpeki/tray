
import fs from "fs";
import path from "path";
import util from "util";

// Shamelessly copied from https://stackoverflow.com/a/46391945
const traverse = function(dir, result = []) {

	fs.readdirSync(dir).forEach((file) => {

		const fPath = path.resolve(dir, file);

		const fileStats = { file, path: fPath };

		if (fs.statSync(fPath).isDirectory()) {
			fileStats.type = 'dir';
			fileStats.files = [];
			result.push(fileStats);
			return traverse(fPath, fileStats.files)
		}

		fileStats.type = 'file';
		result.push(fileStats);

	});

	return result;

};

// Return simple strings of PDF paths
const traverse2 = function(dir, result = []) {

	fs.readdirSync(dir).forEach((file) => {

		const fPath = path.resolve(dir, file);

		if (fs.statSync(fPath).isDirectory()) {
			return traverse2(fPath, result)
		}

		result.push(fPath);

	});

	return result;

};

async function comparePdfsInFolders(baseline, latest) {

	var baselineFiles = [];
	traverse2(baseline, baselineFiles);

	var latestFiles = [];
	traverse2(latest, latestFiles);

	// This output has [Object]s
	// console.log(baselineFiles);

	// Full output:
	// console.log(util.inspect(baselineFiles, { depth: null }));

	baselineFiles.forEach( (baselineFile) => {

		const pathFull = path.dirname(baselineFile);
		const pathBits = path.normalize(pathFull).split(path.sep).filter(Boolean);

		console.log(baselineFile);
		console.log(pathFull);
		console.log(pathBits);
		console.log("");

	});

}

await comparePdfsInFolders("baseline", "other");

