
// certVer.js

import { existsSync, readFileSync } from "node:fs";
import { createSign } from "node:crypto";

import qz from "../../../../js/qz-tray.js"

// Cert Logic

// Verify the certificate used during priting.
export function certVer(certPath, pkeyPath) {

	if (existsSync(certPath) && existsSync(pkeyPath)) {

		const cert = readFileSync(certPath, 'utf8');
		const pkey = readFileSync(pkeyPath, 'utf8');

		qz.security.setCertificatePromise(function(resolve, reject) {
			resolve(cert);
		});

		qz.security.setSignatureAlgorithm("SHA512");
		qz.security.setSignaturePromise(function(toSign) {
			return function(resolve, reject) {
				var sign = createSign('SHA512');
				sign.update(toSign);
				var signature = sign.sign({ key: pkey }, 'base64');
				resolve(signature);
			};
		});

	}

	else {
		console.warn("Certificate or Pkey not found, proceding without them, expected:", certPath, pkeyPath)
		console.warn(" - To resolve: QZ Tray --> Advanced --> Site Manager --> '+' --> Create New")
		console.warn("   - cp ~'/Desktop/QZ Tray Demo Cert/digital-certificate.txt' ./cert.txt") // TODO
		console.warn("   - cp ~'/Desktop/QZ Tray Demo Cert/private-key.pem' ./pkey.txt") // TODO
	}

}

