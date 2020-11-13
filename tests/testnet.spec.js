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

/**
 * Please set your private/public keys and existing fioAddresses
 */
let privateKey = '',
  publicKey = '',
  privateKey2 = '',
  publicKey2 = '',
  testFioAddressName = '',
  testFioAddressName2 = ''

const baseUrl = 'https://testnet.fioprotocol.io:443/v1/'

const fioTestnetDomain = 'fiotestnet'
const fioTokenCode = 'FIO'
const fioChainCode = 'FIO'
const ethTokenCode = 'ETH'
const ethChainCode = 'ETH'
const defaultFee = 800 * FIOSDK.SUFUnit

global.fioSdk = null
global.fioSdk2 = null

const generateTestingFioAddress = (customDomain = fioTestnetDomain) => {
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
  global.fioSdk = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  await timeout(1000)
  global.fioSdk2 = new FIOSDK(
    privateKey2,
    publicKey2,
    baseUrl,
    fetchJson
  )

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
  try {
    const isAvailableResult2 = await fioSdk2.isAvailable(testFioAddressName2)
    if (!isAvailableResult2.is_registered) {
      await fioSdk2.pushTransaction(
        Constants.actionNames.regaddress,
        {
          fio_address: testFioAddressName2,
          owner_fio_public_key: publicKey2,
          max_fee: defaultFee
        }
      )
    }
  } catch (e) {
    console.log(e);
  }

  await timeout(4000)
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
