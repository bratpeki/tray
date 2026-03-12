
// calculateOutPath.js

import { osSplitter } from "./osSplitter.js";

// Returns the subfolder name for storing generated PDFs based on the current OS.
export function calculateOutPath() {
	return osSplitter("windows_bullzip", "linux_cupspdf", "macos_pdfwriter");
}

