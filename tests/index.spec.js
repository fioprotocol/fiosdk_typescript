require('mocha')
const { expect } = require('chai')
const {
  generalTests,
  fioRequest,
  cancelRequest,
  rejectRequest,
  transfer,
  recordObt,
  encryptDecrypt,
} = require('./cases')
const { FIOSDK } = require('../lib/FIOSDK')
const { SignedTransaction } = require('../lib/transactions/signed/SignedTransaction')
const { EndPoint } = require('../lib/entities/EndPoint')
const { Constants } = require('../lib/utils/constants')

fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

let privateKey, publicKey, privateKey2, publicKey2, testFioAddressName, testFioAddressName2
const mnemonic = 'property follow talent guilt uncover someone gain powder urge slot taxi sketch'
const mnemonic2 = 'round work clump little air glue lemon gravity shed charge assault orbit'

/**
 * Urls required
 */
const baseUrl = ''

/**
 * Keys to transfer funds to be able make all calls with fee
 */
const faucetPub = '';
const faucetPriv = '';

const fioTokenCode = 'FIO'
const fioChainCode = 'FIO'
const ethTokenCode = 'ETH'
const ethChainCode = 'ETH'
const fundAmount = 800 * FIOSDK.SUFUnit
const defaultFee = 800 * FIOSDK.SUFUnit
const receiveTransferTimout = 5000

global.fioSdk = null
global.fioSdk2 = null

const generateTestingFioAddress = (customDomain = 'edge') => {
  return `testing${Date.now()}@${customDomain}`
}

const generateTestingFioDomain = () => {
  return `testing-domain-${Date.now()}`
}

const generateObtId = () => {
  return `${Date.now()}`
}

const timeout = async (ms) => {
  await new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const defaultTestParams = {
  testFioAddressName,
  testFioAddressName2,
  fioChainCode,
  fioTokenCode,
  defaultFee,
  timeout
}

before(async () => {
  let privateKeyRes = await FIOSDK.createPrivateKeyMnemonic(mnemonic)
  privateKey = privateKeyRes.fioKey
  let publicKeyRes = FIOSDK.derivedPublicKey(privateKey)
  publicKey = publicKeyRes.publicKey
  fioSdk = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )
  testFioAddressName = generateTestingFioAddress()

  await timeout(1000)
  privateKeyRes = await FIOSDK.createPrivateKeyMnemonic(mnemonic2)
  privateKey2 = privateKeyRes.fioKey
  publicKeyRes = FIOSDK.derivedPublicKey(privateKey2)
  publicKey2 = publicKeyRes.publicKey
  fioSdk2 = new FIOSDK(
    privateKey2,
    publicKey2,
    baseUrl,
    fetchJson
  )
  testFioAddressName2 = generateTestingFioAddress()

  const fioSdkFaucet = new FIOSDK(
    faucetPriv,
    faucetPub,
    baseUrl,
    fetchJson
  )
  await fioSdkFaucet.transferTokens(publicKey, fundAmount * 4, defaultFee)
  await fioSdkFaucet.transferTokens(publicKey2, fundAmount, defaultFee)
  await timeout(receiveTransferTimout)

  try {
    const isAvailableResult = await fioSdk.isAvailable(testFioAddressName)
    if (!isAvailableResult.is_registered) {
      await fioSdk.pushTransaction(
        Constants.actionNames.regaddress,
        {
          fio_address: testFioAddressName,
          owner_fio_public_key: publicKey,
          max_fee: defaultFee
        }
      )
    }

  } catch (e) {
    console.log(e);
  }
})

describe('Testing generic actions', () => generalTests({
  ...defaultTestParams,
  ethTokenCode,
  ethChainCode,
  generateTestingFioDomain,
  generateTestingFioAddress
}))

describe('Request funds, approve and send', () => fioRequest({
  ...defaultTestParams
}))

describe('Request funds, cancel funds request', () => cancelRequest({
  ...defaultTestParams
}))

describe('Request funds, reject', () => rejectRequest({
  ...defaultTestParams
}))

describe('Transfer tokens', () => transfer({
  ...defaultTestParams
}))

describe('Record obt data, check', () => recordObt({
  ...defaultTestParams,
  generateObtId
}))

describe('Encrypting/Decrypting', () => encryptDecrypt({ baseUrl, fetchJson }))

describe('Check prepared transaction', () => {
  it(`requestFunds prepared transaction`, async () => {
    fioSdk2.setSignedTrxReturnOption(true)
    const content = {
      payer_fio_public_key: publicKey,
      payee_public_address: publicKey2,
      amount: `200000`,
      chain_code: fioChainCode,
      token_code: fioTokenCode,
      memo: 'prepared transaction',
      hash: '',
      offline_url: '',
    }
    const trx = new SignedTransaction()
    const preparedTrx = await fioSdk2.pushTransaction(Constants.actionNames.newfundsreq, {
      payer_fio_address: testFioAddressName,
      payee_fio_address: testFioAddressName2,
      max_fee: defaultFee,
      content: trx.getCipherContent(Constants.CipherContentTypes.new_funds_content, content, fioSdk2.privateKey, publicKey)
    }, {
      account: Constants.abiAccounts.fio_reqobt
    })

    const result = await fioSdk2.executePreparedTrx(EndPoint.newFundsRequest, preparedTrx)
    expect(result).to.have.all.keys('fio_request_id', 'status', 'fee_collected')
    expect(result.fio_request_id).to.be.a('number')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    fioSdk2.setSignedTrxReturnOption(false)
  })
})
