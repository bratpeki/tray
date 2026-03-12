
// calculateDelim.js

import { osSplitter } from "./osSplitter.js";

// Gets the delimiter used by the OS.
export function calculateDelim() {
	return osSplitter("\\", "/", "/");
}

