/*

This is examples for FIOSDK v2

*/

const { FIOSDK } = require('@fioprotocol/fiosdk');
const { EndPoint } = require('@fioprotocol/fiosdk/lib/entities/EndPoint')
const { SignedTransaction } = require('@fioprotocol/fiosdk/lib/transactions/signed/SignedTransaction')
const { Constants } = require('@fioprotocol/fiosdk/lib/utils/constants')

fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const privateKey = 'your_private_key as generated on testnet'
const publicKey = 'your_public_key as generated on testnet'

const recipientPrivateKey = 'recipients_private_key'
const recipientPublicKey = 'recipients_public_key'

const baseUrls = ['https://testnet.fioprotocol.io:443/v1/']

const fioAddress = 'your_fio_address@fiotestnet'
const recipientFioAddress = 'some_fio_address@fiotestnet'
const fundsAmount = FIOSDK.SUFUnit
let fioRequestId

const fioSdk = new FIOSDK(privateKey, publicKey, baseUrls, fetchJson)
const recipientFioSdk = new FIOSDK(recipientPrivateKey, recipientPublicKey, baseUrls, fetchJson)

async function transfer() {
  try {
    const { fee: transferFee } = await fioSdk.getFee(EndPoint.recordObtData)
    await fioSdk.pushTransaction(Constants.actionNames.trnsfiopubky, {
      payee_public_key: recipientPublicKey,
      amount: `${fundsAmount}`,
      max_fee: transferFee,
    }, {
      account: Constants.abiAccounts.fio_token
    })
    console.log('Tokens are sent');
  } catch (e) {
    console.error('transfer error');
    console.error(e);
  }
}

async function addAddress() {
  try {
    const { fee } = await fioSdk.getFee(EndPoint.addPubAddress, fioAddress)
    await fioSdk.pushTransaction(Constants.actionNames.addaddress, {
      fio_address: fioAddress,
      public_addresses: [
        {
          chain_code: 'ETH',
          token_code: 'USDC',
          public_address: '...', // set some key
        },
        {
          chain_code: 'BCH',
          token_code: 'BCH',
          public_address: '...', // set some key
        }
      ],
      max_fee: fee
    })
    console.log('Public addresses added.');
  } catch (e) {
    console.error('addAddress error');
    console.error(e);
  }
}

async function fioRequest() {
  try {
    const { fee } = await fioSdk.getFee(EndPoint.newFundsRequest, fioAddress)
    const content = {
      payer_fio_public_key: recipientFioAddress,
      payee_public_address: fioSdk.publicKey,
      amount: `${fundsAmount}`,
      chain_code: 'FIO',
      token_code: 'FIO',
      memo: '',
      hash: '',
      offline_url: '',
    }
    const trx = new SignedTransaction()
    const { fio_request_id } = await fioSdk.pushTransaction(Constants.actionNames.newfundsreq, {
      payer_fio_address: recipientFioAddress,
      payee_fio_address: fioAddress,
      max_fee: fee,
      content: trx.getCipherContent(Constants.CipherContentTypes.new_funds_content, content, privateKey, recipientPublicKey)
    }, {
      account: Constants.abiAccounts.fio_reqobt
    })
    console.log('FIO Request is sent. Request id - ', fio_request_id);
    fioRequestId = fio_request_id
  } catch (e) {
    console.error('fioRequest error');
    console.error(e);
  }

  // check fio request is sent
  try {
    const { requests } = await fioSdk.get(EndPoint.sentFioRequests, {
      fio_public_key: fioSdk.publicKey
    }, {
      decrypt: {
        key: 'requests',
        contentType: Constants.CipherContentTypes.new_funds_content
      }
    })
    console.log('Sent FIO Requests - ', requests);
  } catch (e) {
    console.error('fioRequest error');
    console.error(e);
  }
}

async function rejectFioRequest() {
  try {
    if (!fioRequestId) return throw new Error('fioRequestId was not set')

    const { fee } = await recipientFioSdk.getFee(EndPoint.rejectFundsRequest, recipientFioAddress) // payerFioAddress
    await recipientFioSdk.pushTransaction(Constants.actionNames.rejectfndreq, {
      fio_request_id: fioRequestId,
      max_fee: fee,
    }, {
      account: Constants.abiAccounts.fio_reqobt
    })
    console.log('FIO Request is rejected');
  } catch (e) {
    console.error('rejectFioRequest error');
    console.error(e);
  }
}

async function main() {
  await transfer()
  await addAddress()
  await fioRequest()
  await rejectFioRequest()
}

main()
