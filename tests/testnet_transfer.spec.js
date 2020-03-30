require('mocha')
const { expect } = require('chai')
const { FIOSDK } = require('../lib/FIOSDK')

fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

// transfers FIO tokens from privatekey to publicKey2


/**
 * Please set your private/public keys and existing fioAddresses
 */
let privateKey = '5KiFV1f2hPy9RMNoYG5RzRrK83juBBQbGsjcFSPR7qWFR362R1F',
  publicKey = 'FIO8DdUqTc2QmAaiMHrfcY3AoEsMgVars5sjpePQUpKfSZweiFneY',
  privateKey2 = '5JJJwyg6a8aGeQhC9Yq3PRriZL463cmDyGtdAwCs3XW8uEbUh2q',
  publicKey2 = 'FIO7FsRwGNdhQfVJ3kHgeDrP5DRHHZF4gVKsqGdpiP2eWZzppySJF',
  testFioAddressName = 'shawnalicek@fiotestnet',
  testFioAddressName2 = 'shawnbobk@fiotestnet'

const baseUrl = 'https://testnet.fioprotocol.io:443/v1/'

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


