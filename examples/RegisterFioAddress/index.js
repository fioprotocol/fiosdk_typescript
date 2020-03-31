/*
This is an example, of how to instantiate the FIOSDK and register a fio address.

Use testnet to register your private/public keys and fund your account.

See the main readme.md for complete details on how to work with testnet:
https://github.com/fioprotocol/fiosdk_typescript/blob/master/README.md

*/

const fio = require('@fioprotocol/fiosdk');

fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const privateKey = 'your_private_key as generated on testnet'
const publicKey = 'your_public_key as generated on testnet'

const baseUrl = 'https://testnet.fioprotocol.io:443/v1/'

const fioAddress = 'your_fio_address@fiotestnet'
const defaultFee = 800 * fio.FIOSDK.SUFUnit

async function main () {

	const fioSdk = new fio.FIOSDK(privateKey, publicKey, baseUrl, fetchJson)

	console.log("")
	console.log("Register this FIO Address:")
	console.log(fioAddress)
	console.log("")

	const result = await fioSdk.registerFioAddress (fioAddress, defaultFee)

	console.log ("Registration Results: ")
	console.log(result)
}

main()
