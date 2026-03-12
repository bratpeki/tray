
// osSplitter.js

import os from "node:os";

// OS username
const username = os.userInfo().username;

// Get the appropriate item based on the OS.
//
// Used by the other modules in this folder.
export function osSplitter( windowsOption, linuxOption, macOption ) {
	switch ( os.platform() ) {
		case "win32": return windowsOption;
		case "linux": return linuxOption;
		case "darwin": return macOption;
		default: throw new Error(`ERROR (osSplitter): Unsupported OS (${os.platform()})`);
	}
}

