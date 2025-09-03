
import os from "os";
import path from "path";

// OS username
const username = os.userInfo().username;

/**
 * Calculates the absolute path where the PDF printer
 * outputs generated PDF files, based on the current operating system.
 *
 * - **Linux (CUPS)**: `/var/spool/cups-pdf/{username}`
 * - **macOS (PDFWriter)**: `/private/var/spool/pdfwriter/{username}`
 * - **Windows**: Not implemented yet
 *
 * @function calculatePdfPrintPath
 * @returns {string} Absolute path where the PDF printer saves generated files
 *
 * @note This function relies on {@link os.userInfo} to resolve the username.
 */
export function calculatePdfPrintPath() {

	switch ( os.platform() ) {

		case "win32":
			return ""; // TODO

		case "linux":
			return path.join("/", "var", "spool", "cups-pdf", username);

		case "darwin":
			return path.join("/", "private", "var", "spool", "pdfwriter", username);

	}

}

