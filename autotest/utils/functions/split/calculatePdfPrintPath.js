
// calculatePdfPrintPath.js

import * as os from "node:os";
import * as path from "node:path";

import { osSplitter } from "./osSplitter.js";

// OS username
const username = os.userInfo().username;

// Calculates the absolute path where the PDF printer outputs generated PDF files.
export function calculatePdfPrintPath() {
	return osSplitter(
		path.join("C:", "Users", username, "PDF"),
		path.join("/", "home", username, "PDF"),
		path.join("/", "private", "var", "spool", "pdfwriter", username)
	);
}

