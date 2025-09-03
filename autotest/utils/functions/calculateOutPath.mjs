
import os from "os";

/**
 * Calculates the output folder name for generated PDF assets,
 * depending on the operating system and the PDF printer used.
 *
 * The folder name is derived from:
 * - **Linux**: Uses CUPS-PDF, so output goes into `linux_cupspdf`
 * - **macOS**: Uses the built-in PDF writer, so output goes into `macos_pdfwriter`
 * - **Windows**: Not implemented yet
 *
 * For example,
 * if the PDF hierarchy root is `baseline`,
 * then on Linux the path would be `baseline/linux_cupspdf`
 *
 * @note The reason for this difference in export location is because different PDF printers print different files (Thanks, CUPS!)
 *
 * @function calculateOutPath
 * @returns {string} The relative folder name where PDF assets should be stored.
 */

export function calculateOutPath() {
	switch (os.platform()) {
		case "win32":  return ""; // TODO
		case "linux":  return "linux_cupspdf";
		case "darwin": return "macos_pdfwriter";
		default: throw new Error(`ERROR (calculateOutPath): Unsupported platform (${os.platform()})`);
	}
}
