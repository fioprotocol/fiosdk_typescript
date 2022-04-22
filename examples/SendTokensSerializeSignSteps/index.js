fetch = require('node-fetch')
const { FIOSDK } = require('../../lib/FIOSDK');

const privateKey = ''
const publicKey = ''
const payeePublicKey = ''

const baseUrl = '' // https://testnet.fioprotocol.io:443/v1/
const defaultFee = 800 * FIOSDK.SUFUnit

const fetchJson = async (uri, opts = {}) => {
	return fetch(uri, opts)
}

const timeout = async (ms) => {
	await new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}

async function main () {
	const fundsAmount = 2 * FIOSDK.SUFUnit
	const publicFioSdk = new FIOSDK(
		'',
		'',
		baseUrl,
		fetchJson
	);
	await timeout(4000)

	const chainData = await publicFioSdk.transactions.getChainDataForTx();
	const transaction = await publicFioSdk.transactions.createRawTransaction({
		action: 'trnsfiopubky',
		account: 'fio.token',
		data: {
			payee_public_key: payeePublicKey,
			amount: fundsAmount,
			max_fee: defaultFee,
			tpid: '',
			// actor
		},
		publicKey,
		chainData,
	});

	const { serializedContextFreeData, serializedTransaction } = await publicFioSdk.transactions.serialize({
		chainId: chainData.chain_id,
		transaction,
	});

	const signedTransaction = await publicFioSdk.transactions.sign({
		chainId: chainData.chain_id,
		privateKeys: [privateKey],
		transaction,
		serializedTransaction,
		serializedContextFreeData,
	});

	const result = await publicFioSdk.executePreparedTrx('transfer_tokens_pub_key', signedTransaction);
	console.log(result);
}

main()
