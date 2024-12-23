const fio = require('@fioprotocol/fiosdk');
const mnemonic = 'valley alien library bread worry brother bundle hammer loyal barely dune brave'

async function genKeysFromMnemonic () {

	console.log("")
	console.log("From This Mnemonic:")
	console.log(mnemonic)
	console.log("")

	// Private key generation in the SDK is available for testing purposes only. Do not generate private keys for production application using these methods. Instead pass securely generated private keys or seed phrase to the SDK constructor.
	const privateKeyRes = await fio.FIOSDK.createPrivateKeyMnemonic(mnemonic)
	console.log("Private key generated:")
	console.log((privateKeyRes.fioKey))
	console.log("")

	const publicKeyRes = fio.FIOSDK.derivedPublicKey(privateKeyRes.fioKey)
	console.log("Public key generated:")
	console.log((publicKeyRes.publicKey))
	console.log("")
}

genKeysFromMnemonic()
