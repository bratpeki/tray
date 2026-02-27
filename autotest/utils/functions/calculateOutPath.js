
import { osSplitter } from "./osSplitter.js";

/**
 * Returns the subfolder name for storing generated PDFs based on the current OS.
 *
 * <p/>
 *
 * <ul>
 *   <li> <code>linux_cupspdf</code> </li>
 *   <li> <code>macos_pdfwriter</code> </li>
 *   <li> <code>windows_bullzip</code> </li>
 * </ul>
 *
 * @note The reason for this difference in export location is because different PDF printers print different files (Thanks, CUPS!)
 *
 * @returns {string} The relative folder name where PDF assets should be stored.
 *
 * @throws {Error} If the OS is unsupported.
 */

export function calculateOutPath() {
	return osSplitter("windows_bullzip", "linux_cupspdf", "macos_pdfwriter");
}
