
import os from "os";

/**
 * Returns the delimiter used by the OS.
 *
 * @returns {string} The delimiter.
 *
 * @throws {Error} If the OS is unsupported.
 */

export function calculateDelim() {
	switch (os.platform()) {

		case "win32":
			return "\\";

		case "linux":
		case "darwin":
			return "/";

		default: throw new Error(`ERROR (calculateOutPath): Unsupported OS (${os.platform()})`);

	}
}
