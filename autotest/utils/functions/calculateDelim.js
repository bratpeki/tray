
import { osSplitter } from "./osSplitter.js";

/**
 * Returns the delimiter used by the OS.
 *
 * @returns {string} The delimiter.
 *
 * @throws {Error} If the OS is unsupported.
 */

export function calculateDelim() {
	return osSplitter("\\", "/", "/");
}
