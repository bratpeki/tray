
import os from "os";
import path from "path";

// OS username
const username = os.userInfo().username;

/**
 * @function
 *
 * Calculates the absolute path where the PDF printer
 * outputs generated PDF files, based on the current operating system.
 *
 * For each OS, the output location is:
 * - Linux (CUPS-PDF): `/var/spool/cups-pdf/{username}`
 * - MacOS (PDFWriter): `/private/var/spool/pdfwriter/{username}`
 * - Windows: TODO
 *
 * @returns {string} Absolute path where the PDF printer saves generated files
 * @throws Will throw an error if the OS is unsupported
 *
 * @note This function relies on {@link os.userInfo} to resolve the username.
 */
export function calculatePdfPrintPath() {
	switch ( os.platform() ) {
		// case "win32": return "";
		case "linux": return path.join("/", "var", "spool", "cups-pdf", username);
		case "darwin": return path.join("/", "private", "var", "spool", "pdfwriter", username);
		default: throw new Error(`ERROR (calculateOutPath): Unsupported OS (${os.platform()})`);
	}
}

