require('mocha')
const { expect } = require('chai')
const { FIOSDK } = require('../lib/FIOSDK')

fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

// Transfers FIO tokens from privatekey to publicKey2
// Can be used to fund accounts for testing purposes

/**
 * Please set your private/public keys and existing fioAddresses
 */
let privateKey = '',
  publicKey = '',
  privateKey2 = '',
  publicKey2 = ''

/**
 * Public Testnet API nodes can be found at: https://github.com/fioprotocol/fio.mainnet
 */

 const baseUrl = 'https://testnet.fioprotocol.io/v1/'   // e.g., 'https://testnet.fioprotocol.io/v1/'

const fioTestnetDomain = 'fiotestnet'
const fioTokenCode = 'FIO'
const fioChainCode = 'FIO'
const defaultFee = 800 * FIOSDK.SUFUnit
const transferAmount = 900 * FIOSDK.SUFUnit

let fioSdk, fioSdk2

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

before(async () => {
  fioSdk = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  await timeout(1000)
  fioSdk2 = new FIOSDK(
    privateKey2,
    publicKey2,
    baseUrl,
    fetchJson
  )

  
})

describe('Transfer tokens', () => {
  const fundsAmount = transferAmount
  let fioBalance = 0
  let fioBalanceAfter = 0

  it(`Check balance before transfer`, async () => {
    const result = await fioSdk2.genericAction('getFioBalance', {})

    fioBalance = result.balance
  })

  it(`Transfer tokens`, async () => {
    const result = await fioSdk.genericAction('transferTokens', {
      payeeFioPublicKey: publicKey2,
      amount: fundsAmount,
      maxFee: defaultFee,
    })

    expect(result).to.have.all.keys('status', 'fee_collected', 'transaction_id', 'block_num')
    expect(result.status).to.be.a('string')
    expect(result.transaction_id).to.be.a('string')
    expect(result.block_num).to.be.a('number')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`Check balance and balance change`, async () => {
    await timeout(10000)
    const result = await fioSdk2.genericAction('getFioBalance', {})
    console.log ("FIO Token balance: " + result.balance/FIOSDK.SUFUnit)
  })
})


