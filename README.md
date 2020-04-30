# FIO TypeScript SDK
The Foundation for Interwallet Operability (FIO) is a consortium of leading blockchain wallets, exchanges and payments providers that seeks to accelerate blockchain adoption by reducing the risk, complexity, and inconvenience of sending and receiving cryptoassets.

For information on FIO, visit the [FIO website](https://fio.foundation).

For information on the FIO Chain, API, and SDKs visit the [FIO Protocol Developer Hub](https://developers.fioprotocol.io).

# Technology
The FIO TypeScript SDK is built using tsc, to generate the JavaScript files.

# Version 
Visit the [FIO Protocol Developer Hub](https://developers.fioprotocol.io) to get information on FIO SDK versions. Only use an SDK that has a major version number that matches the current FIO Protocol blockchain major version number (e.g. 1.x.x).

# Installing FIO TypeScript SDK, using npm:
## The NPM Version is here:
	@fioprotocol/fiosdk

# Building The FIO TypeScript SDK, manually
#### Building FIO TypeScript SDK, manually
Navigate to the "fiosdk_typescript" folder, run yarn to install its dependencies, then run tsc to compile. Before running the test refer to the "Workflow for using the SDK with TestNet" section of this README.
	
	cd fiosdk_typescript
	yarn
	tsc
	npm test (if you would like to run the unit tests)

### Errors with compiling the SDKs
#### Unable to find tsc
Make sure to install typescript by running, this command in terminal:
	
	sudo npm install -g typescript

# Publishing to Node Package Manager (npm)
To publish to npm.  
1. Update the version number, for this release. In 'package.json'
2. If the fioJS library was updated in npm.  Also update the fioJS version number.  In 'package.json'
3. Publish to npm:

		cd fiosdk_typescript
		yarn
		tsc
		npm test
		npm publish --access public

Further details: 
	http://npmjs.com/ 
	https://docs.npmjs.com/creating-and-publishing-scoped-public-packages

# Generating Documentation
TypeDoc is installed as a dev dependency. Documentation is pre-generated and included with the source code. To manually generate the documentation run: 
	
	cd fiosdk_typescript
	./build_docs.sh

The documentation will appear in the folder "documentation" in the root of the project.

## Issues Installing TypeDoc?
If typedoc command is not found, install typedoc using the npm global command:
	
	npm install --global typedoc

# Using the SDK
The SDK uses a singleton model requiring initialization in the constructor as these parameters are referenced in subsequent SDK Calls.

## Base URL for TestNet
	http://testnet.fioprotocol.io/v1/

## TestNet Monitor Tool
	https://monitor.testnet.fioprotocol.io/

## Initializing the SDK

	fetch = require('node-fetch')

	const fetchJson = async (uri, opts = {}) => {
		return fetch(uri, opts)
	}

	privateKey/publicKey - the wallet user's private/public keys
	baseURL - the base URL to the FIO Protocol blockchain API (e.g., http://testnet.fioprotocol.io/v1/)
	fetchjson - a reference to fetchJson - this is the module to use for http post/get calls (see above for an example)
	registerMockUrl - the URL of the server used to auto-register FIO names for wallet users. This is only used by wallets that have deployed a central server used to register names on their domain. It is used by the registerOnBehalfOfUser method
	
	constructor(
	    privateKey: string,
	    publicKey: string,
	    baseUrl: string,
	    fetchjson: fetchJson,
	    registerMockUrl = '',
	  )

## Using the SDK
### Example Usage in JavaScript
	const fio = require('@fioprotocol/fiosdk');

	this.fioSDK = new fio.FIOSDK(privateFioKey, publicFioKey, 'http://testnet.fioprotocol.io/v1/', this.fetchJson, '')

# Workflow for using the SDK with TestNet
Most Signed API calls charge fees and require a FIO address that is associated with the user making the call. 

#### Creating a test account with FIO tokens
When running a test you will want to register addresses and transfer funds. But, registering a new address for the first time requires FIO tokens. Therefore, some manual setup is required to associate FIO tokens with a FIO public key. To set up a FIO public key with FIO tokents in a test environment:
 
1. Manually create two private/public FIO key pairs 
	1. Navigate to the website: https://monitor.testnet.fioprotocol.io
	2. Select the 'Create Keypair' button (top left of the website)
	3. Copy the keypairs and FIO Internal Account 
2. Manually register a FIO address for both of these FIO key pairs. 
	1. Navigate to the website: https://monitor.testnet.fioprotocol.io
	2. Select the 'Register Address' button
	3. Type in a FIO address 
	4. Paste in one of the public keys (created above)
	5. Select the 'Create' button
	6. Do this for each public key pair (twice).  The created FIO address will be in this format, "mytest:fiotestnet"
3. Manually transfer funds into these FIO addresses.
	1. Navigate to the website: https://monitor.testnet.fioprotocol.io
	2. Select the 'Faucet' button
	3. Paste in one of the public keys (created above)
	4. Select the 'Send Coins' button
	5. Do this for each public key pair (twice)
4. These FIO public addresses now have funds available for making Signed API calls.
5. Edit the test script to add these FIO addresses and the private/public FIO key pairs
	1. Edit the privateKey, publicKey, privateKey2, publicKey2, testFioAddressName, testFioAddressName2 variables in the testnet.spec file (/fiofoundation-io-fiosdk/tests/testnet.spec)
6. Run the tests: 
	npm test

#### When calling a Signed API call that charges FEES, 
Use the following steps to determine the fee and pass it to the signed call.

	1. Call getFee to get the fee for the Signed API call
	2. Call the API Signed call with the fee

# Example Code

	Example code is located here:
		\examples

	For an example of how to generate keys using the SDK, see the sample project here:
		\examples
			\GenerateFioKeys

	For an example on how to instantiate the SDK, and register a fio address.  See the sample project here:
		\examples
			\RegisterFioAddress

# FIO Private/Public Keys?
The SDK provides calls to generate FIO Private/Public Key pairs.  

### Generating FIO Keys
The user's FIO private/public key can be generated by calling these methods on the sdk:

	createPrivateKeyMnemonic OR createPrivateKey
	AND
	derivedPublicKey

# Example Usage
	For an example of how to generate keys using the SDK, see the sample project here:
		\examples
			\GenerateFioKeys

### Example Key Generation Code

	using npm, create a javascript file ('index.js), and run "node index.js"

	i.e. JavaScript code ('index.js):

	const fio = require('@fioprotocol/fiosdk');
	const mnemonic = 'valley alien library bread worry brother bundle hammer loyal barely dune brave'

	async function genKeysFromMnemonic () {

		console.log("")
		console.log("From This Mnemonic:")
		console.log(mnemonic)
		console.log("")

		const privateKeyRes = await fio.FIOSDK.createPrivateKeyMnemonic(mnemonic)
		console.log("private key generated:")
		console.log((privateKeyRes.fioKey))
		console.log("")

		const publicKeyRes = fio.FIOSDK.derivedPublicKey(privateKeyRes.fioKey)
		console.log("public key generated")
		console.log((publicKeyRes.publicKey))
		console.log("")
	}

	genKeysFromMnemonic()

### Manually Creating Keys without using the FIO Typescript SDK?
The following information can be used to manually generate FIO keys:

FIO Keys use SLIP-235 for BIP-0044.
https://github.com/satoshilabs/slips/blob/master/slip-0044.md

Following the EOS example of private and public key generation. We replace EOS slip '194' with '235'.  And 'EOS' public key prefix with 'FIO'.
https://eosio.stackexchange.com/questions/397/generate-eos-keys-from-mnemonic-seed

##  FIO Key Derivation Path:
"44'/235'/0'/0/0"

## FIO Key Generation Testing

Using this mnemonic phrase:
"valley alien library bread worry brother bundle hammer loyal barely dune brave"

This is the expected Private Key:
"5Kbb37EAqQgZ9vWUHoPiC2uXYhyGSFNbL6oiDp24Ea1ADxV1qnu"

This is the expected Public Key:
"FIO5kJKNHwctcfUM5XZyiWSqSTM5HTzznJP9F3ZdbhaQAHEVq575o"

## Version 1.0.2
Bug Fix to method: addPublicAddresses - TechnologyProviderId (i.e. TPID), was not being set correctly for this method.

## Version 1.0.1
Added method: registerOwnerFioAddress - allows a wallet to register a fio address owned by a different public key
Updated Validation Methods
Updated Documentation on FIOSDK instantiation

## Version 1.0.0
Added additional Unit Tests for Encryption.  Comparing and Validating results across the kotlin, iOS and typescript SDKs.
No changes to the SDK code base.

## Version 0.9.2
Updated and cleaned up SDK code base.
Finalization of method names and parameter names and order
