
import os from "os";

// Calculate the "outPath" used in "utils/configs" files
export function calculateOutPath() {

	switch ( os.platform() ) {
		case "win32":  return ""; // TODO
		case "linux":  return "linux_cupspdf";
		case "darwin": return "macos_pdfwriter";
	}

}

