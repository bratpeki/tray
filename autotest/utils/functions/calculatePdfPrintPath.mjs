
import os from "os";
import path from "path";

// OS username
// TODO: username or userName? I'm thinking it's one word, so the former
const username = os.userInfo().username;

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

