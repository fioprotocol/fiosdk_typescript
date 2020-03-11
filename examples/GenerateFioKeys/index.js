const fio = require('@fioprotocol/fiosdk');
const mnemonic = 'valley alien library bread worry brother bundle hammer loyal barely dune brave'

async function genKeysFromMnemonic () {

	console.log("")
	console.log("From This Mnemonic:")
	console.log(mnemonic)
	console.log("")

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
