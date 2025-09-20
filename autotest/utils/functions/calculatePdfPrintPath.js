
import os from "os";
import path from "path";

// OS username
const username = os.userInfo().username;

/**
 * Calculates the absolute path where the PDF printer
 * outputs generated PDF files, based on the current operating system.
 *
 * <p/>
 *
 * For each OS, the output location is:
 *
 * <ul>
 *   <li> Linux (CUPS-PDF): <code>/var/spool/cups-pdf/{username}</code> </li>
 *   <li> MacOS (PDFWriter): <code>/private/var/spool/pdfwriter/{username}</code> </li>
 *   <li> Windows: TODO </li>
 * </ul>
 *
 * @returns {string} Absolute path where the PDF printer saves generated files.
 *
 * @throws {Error} If the OS is unsupported.
 *
 * @note This function relies on {@link os.userInfo} to resolve the username.
 */
export function calculatePdfPrintPath() {
	switch ( os.platform() ) {
		// case "win32": return "";
		case "linux": return path.join("/", "var", "spool", "cups-pdf", username);
		case "darwin": return path.join("/", "private", "var", "spool", "pdfwriter", username);
		default: throw new Error(`ERROR (calculatePdfPrintPath): Unsupported OS (${os.platform()})`);
	}
}

