/*
This is an example, of how to instantiate the FIOSDK and validate a FIO public key.

Use testnet to register your private/public keys and fund your account.

See the main readme.md for complete details on how to work with testnet:
https://github.com/fioprotocol/fiosdk_typescript/blob/master/README.md

*/
const { Ecc } = require('@fioprotocol/fiojs');
const ecurve = require('ecurve');
const secp256k1 = ecurve.getCurveByName('secp256k1');

const validPublicKey = 'FIO5ReMUvFM9X12eSuAR4QKjHsGJ6qponQP36xtV7WZLPBG35dJTr'
const invalidPublicKey = 'FIO5ReMUvFM9X12eSufe4QKjHsGJ6qponQP36xtV7WZLPBG35dJTr'
const invalidPublicKey2 = 'FIO5ReMUvFM9X12eSufe4QKjHsGJ6qponQP36xtWZLPBG35dJTr'

async function main () {

	console.log("\n1. Check if valid:", validPublicKey)

	let isValid = await isPubKeyValid(validPublicKey)

	console.log ("Validation result:", isValid)


	console.log("\n2. Check if valid:", validPublicKey)

	isValid = await isPubKeyValid(invalidPublicKey)

	console.log ("Validation result:", isValid)


	console.log("\n3. Check if valid:", invalidPublicKey2)

	isValid = await isPubKeyValid(invalidPublicKey2)

	console.log ("Validation result:", isValid)
}

async function isPubKeyValid(publicKey) {

	if (publicKey.length !== 53) return false

	// return Ecc.isValidPublic(publicKey)

	const PUB_KEY_PREFIX = 'FIO'
	if (publicKey.substr(0, 3) !== PUB_KEY_PREFIX) return false

	const base58Substr = publicKey.substr(PUB_KEY_PREFIX.length);
	try {
		const buffer = Ecc.key_utils.checkDecode(base58Substr)
		ecurve.Point.decodeFrom(secp256k1, buffer)
	} catch (e) {
		console.error(e);
		return false
	}

	return true
}

main()
