
import os from "os";

// OS username
const username = os.userInfo().username;

/**
 * Get the appropriate item based on the OS.
 * 
 * @param {*} windowsOption Windows option.
 * @param {*} linuxOption Linux option.
 * @param {*} macOption MacOS option.
 * 
 * @returns {string} Absolute path where the PDF printer saves generated files.
 *
 * @throws {Error} If the OS is unsupported.
 *
 * @note This function relies on {@link os.userInfo} to resolve the username.
 */
export function osSplitter( windowsOption, linuxOption, macOption ) {
    switch ( os.platform() ) {
        case "win32": return windowsOption;
        case "linux": return linuxOption;
        case "darwin": return macOption;
        default: throw new Error(`ERROR (osSplitter): Unsupported OS (${os.platform()})`);
    }
}
