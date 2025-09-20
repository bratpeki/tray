
import os from "os";

/**
 * The PDF directory tree has three subfolders:
 *
 * <p/>
 *
 * <ul>
 *   <li> <code>linux_cupspdf</code> </li>
 *   <li> <code>macos_pdfwriter</code> </li>
 *   <li> <code>windows_PRINTERNAME (TODO)</code> </li>
 * </ul>
 *
 * As expected, the names are derived from the OS and the printer that's used to generate the PDFs.
 * That means:
 *
 * <p/>
 *
 * <ul>
 *   <li> Linux + CUPS-PDF </li>
 *   <li> MacOS + PDFWriter </li>
 *   <li> TODO </li>
 * </ul>
 *
 * This function returns the name of that subfolder, depending on the OS.
 *
 * @note The reason for this difference in export location is because different PDF printers print different files (Thanks, CUPS!)
 *
 * @returns {string} The relative folder name where PDF assets should be stored.
 *
 * @throws Will throw an error if the OS is unsupported
 */

export function calculateOutPath() {
	switch (os.platform()) {
		// case "win32":
		case "linux":  return "linux_cupspdf";
		case "darwin": return "macos_pdfwriter";
		default: throw new Error(`ERROR (calculateOutPath): Unsupported OS (${os.platform()})`);
	}
}
