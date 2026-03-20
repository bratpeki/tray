
// startTest.js

// The automated testing starting point
//
// It does the following:
// 1. Generates all the cert/fingerprint prerequisites
// 2. Starts a headless QZ Tray instance and waits until its fully up
// 3. Generates the latest prints
// 4. Compares the prints against the baseline
// 5. Reports back if the test was successful

import fs from 'node:fs';
import util from 'node:util';
import path from 'node:path';
import os from "node:os";
import * as spawn from 'node:child_process';

import * as spawnExpect from "../functions/spawn/spawnExpect.js";
import * as format from "../functions/format/formatOutput.js";
import { generatePdfs } from "../functions/generate/generatePdfs.js";
import { osSplitter } from "../functions/split/osSplitter.js";
import { certVer } from "../functions/qz/certVer.js";
import { comparePdfsInFolders } from "../functions/compare/comparePdfsInFolders.js";

// Variables

const args = process.argv;

// The directory inside which we're running the script
var currentDir = "";
currentDir = path.resolve(process.cwd(), args[1]);
currentDir = path.normalize(currentDir);
currentDir = path.dirname(currentDir);

// allowed.dat lives here
const ALLOWED_DIR = osSplitter(
	path.resolve(process.env.APPDATA || "", 'qz'),
	path.resolve(process.env.HOME || "", '.qz'),
	path.resolve(process.env.HOME || "", "Library", "Application Support", "qz")
);

// Necessary files
const ALLOWED = path.resolve(ALLOWED_DIR, 'allowed.dat');
const TMP_KEY = path.resolve(currentDir, "..", "..", "priv.key");
const TMP_CERT = path.resolve(currentDir, "..", "..", "cert.pem");

// Backup old keys and certs
if (fs.existsSync(TMP_KEY)) fs.renameSync(TMP_KEY, TMP_KEY + ".old");
if (fs.existsSync(TMP_CERT)) fs.renameSync(TMP_CERT, TMP_CERT + ".old");

// Parameters

const certParams = {
	cmd: 'openssl',
	opts: ['req', '-x509', '-newkey', 'rsa:2048', '-keyout', TMP_KEY, '-out', TMP_CERT, '-days', '1', '-nodes', '-subj', '/C=vo/ST=void/L=void/O=void/OU=void/CN=void'],
	desc: "Generate certificate, private key"
};

const fingerParams = {
	cmd: "openssl",
	opts: ['x509', '-fingerprint', '-in', TMP_CERT, '-noout'],
	desc: "Write fingerprint to allowed.dat"
};

const trayParamsWin = {
	cmd: 'C:\\Program Files\\QZ Tray\\runtime\\bin\\java.exe',
	opts: [util.format('-DtrustedRootCert=%s', TMP_CERT), '-jar', 'C:\\Program Files\\QZ Tray\\qz-tray.jar', '--steal'],
	desc: "Start Tray",
	expect: ' started on port'
};

const trayParamsLinux = {
	cmd: '/opt/qz-tray/runtime/bin/java',
	opts: [util.format('-DtrustedRootCert=%s', TMP_CERT), '-jar', '/opt/qz-tray/qz-tray.jar', '--steal', '--headless'],
	desc: "Start Tray",
	expect: ' started on port'
};

const trayParamsMac = {
	cmd: '/Applications/QZ Tray.app/Contents/PlugIns/Java.runtime/Contents/Home/bin/java',
	opts: [util.format('-DtrustedRootCert=%s', TMP_CERT), '-jar', '/Applications/QZ Tray.app/Contents/Resources/qz-tray.jar', '--steal', '--headless'],
	desc: "Start Tray",
	expect: ' started on port',
};

// Functions

// Isolate fingerprint, lowercase, strip delims
//
// stdout: The output string from the openssl command.
// returns: the stripped and formatted fingerprint.
function stripFingerprint(stdout) {
	return stdout.split('=')[1].replace(/:/g, '').trim().toLowerCase();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Convert the fingerprint to the allowed.dat format
function allowedList(fingerprint) {
	const from = '2000-01-01 00:00:00';
	const to = '2099-01-01 00:00:00';
	// Using util.format is fine in MJS/Node.js, but template literals could also be used here.
	// TODO PEKI: Gotta look into this...
	return util.format("%s\tvoid\tvoid\t%s\t%s\ttrue\n", fingerprint, from, to);
}

// Test Logic

const Obj = function() {

	const _obj = {

		certPromise: function() {

			return new Promise(function(resolve, reject) {
				const out = spawn.spawnSync(certParams.cmd, certParams.opts);
				if (!out.status) {
					format.pass(certParams.desc);
					return resolve();
				}
				format.fail(certParams.desc);
				reject(out.stderr ? out.stderr.toString() : "Unknown error generating cert");
			});

		},

		fingerPromise: function() {

			return new Promise(function(resolve, reject) {
				const out = spawn.spawnSync(fingerParams.cmd, fingerParams.opts);
				if (!out.status) {
					const fingerprint = stripFingerprint(out.stdout.toString());
					// Actions hasn't run Tray before, other than "--version"
					// This ensures that directory exists
					// recursive:true is ensuring the directory can already exist, for local tests
					fs.mkdirSync(ALLOWED_DIR, { recursive: true });
					fs.appendFileSync(ALLOWED, allowedList(fingerprint));
					format.pass(fingerParams.desc);
					return resolve();
				}
				format.fail(fingerParams.desc);
				reject(out.stderr ? out.stderr.toString() : "Unknown error generating fingerprint");
			});

		},

		trayPromise: function() {
			// Not using osSplitter here, because these spawnExpect calls
			// have to be done before they enter the function body,
			// and we shouldn't run Windows when we wanna run MacOS, for example.
			switch (os.platform()) {
				case "win32":
					return spawnExpect.spawnExpect(trayParamsWin.cmd, trayParamsWin.opts, trayParamsWin.expect);
				case "linux":
					return spawnExpect.spawnExpect(trayParamsLinux.cmd, trayParamsLinux.opts, trayParamsLinux.expect);
				case "darwin":
					return spawnExpect.spawnExpect(trayParamsMac.cmd, trayParamsMac.opts, trayParamsMac.expect, 60000, trayParamsMac.env);
			}
		},

		kill: function() { spawnExpect.kill(); }
	};

	return _obj;

};

// If this were intended to be a reusable module, we'd use 'export default Obj;'
// But since the original script immediately executes, we follow that pattern.
const TestRunner = new Obj();

// The actual main function where we run the tests from
async function runTest() {

	try {

		format.divider("STARTING QZ TRAY INTEGRATION TEST");

		await TestRunner.certPromise();
		await TestRunner.fingerPromise();

		format.info("\nAttempting to start QZ Tray (Waiting 60 seconds for 'started on port')...");
		await TestRunner.trayPromise();

        // If QZ Tray was already running post-install, we need to '--steal' it, but this could take a second
		await sleep(1000);

		certVer(TMP_CERT, TMP_KEY);

		format.info("\nAttempting to make the latest prints...");
		// /..     /..
		// autotest/utils/standalone
		await generatePdfs(path.resolve(currentDir, "..", "..", "latest"));

		format.info("\nAttempting to compare the baseline and latest prints...");
		const compRes = await comparePdfsInFolders(
			path.resolve(currentDir, "..", "..", "baseline"),
			path.resolve(currentDir, "..", "..", "latest")
		);

		if (compRes === 1) throw new Error("Comparison failure");

		format.divider("TEST SUCCESSFUL");

	}

	catch (error) {
		format.divider("TEST FAILED");
		console.log("");
		console.error(error.stack || error.toString());
	}

	finally {
		format.info("\nAttempting to kill the QZ Tray process and script...");
		TestRunner.kill();
	}
}

// Execute the test runner immediately
runTest();

