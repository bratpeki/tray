
// generateBaselinePdfs.js

// The old baseline generation script.
//
// Now, in favor of this, GitHub Actions
// uploads the latest prints as artifacts, as well as DIFFs.
// So, if there was a problem with our prints, we update them
// by swapping them out for the ones in the artifact.

import assert from "node:assert";
import path from "node:path";

import { generatePdfs } from "../functions/generate/generatePdfs.js";

// CLI args
const args = process.argv;

// The expected calling method is
// "node generate-baseline-pdfs.js" or similar
assert(args[0].includes("node"));
assert(args[1].includes("generate-baseline-pdfs"));

let dirpdf;

if ( args.length < 3 ) {
	console.warn("Folder to generate PDFs in hasn't been passed. Using \"baseline\"");
	dirpdf = "baseline";
}
else {
	dirpdf = args[2];
}

// Normalizing the path in case it uses ".."
dirpdf = path.resolve(process.cwd(), dirpdf);
dirpdf = path.normalize(dirpdf);

// Generation
await generatePdfs(dirpdf);

process.exit(0);

