require('mocha')
const { expect } = require('chai')
const { FIOSDK } = require('../lib/FIOSDK')

fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  const res = await fetch(uri, opts)
  return res.json()
}

const BILLION = 1000000000

/**
 * Please set your private/public keys and existing fioAddresses
 */
let privateKey = '',
  publicKey = '',
  privateKey2 = '',
  publicKey2 = '',
  testFioAddressName = 'myaddressname:fiotestnet',
  testFioAddressName2 = 'myaddressname:fiotestnet'

const baseUrl = 'https://testnet.fioprotocol.io:443/v1/'
const mockBaseUrl = 'https://monitor.testnet.fioprotocol.io'

const fioTestnetDomain = 'fiotestnet'
const fioTokenCode = 'FIO'
const defaultFee = 30 * BILLION

let fioSdk, fioSdk2

const generateTestingFioAddress = (customDomain = fioTestnetDomain) => {
  return `testing${Date.now()}:${customDomain}`
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
    fetchJson,
    mockBaseUrl
  )

  await timeout(1000)
  fioSdk2 = new FIOSDK(
    privateKey2,
    publicKey2,
    baseUrl,
    fetchJson,
    mockBaseUrl
  )

  await timeout(4000)
})

describe('Testing generic actions', () => {

  const newFioDomain = generateTestingFioDomain()
  const newFioAddress = generateTestingFioAddress(newFioDomain)

  it(`Getting fio public key`, async () => {
    const result = await fioSdk.genericAction('getFioPublicKey', {})

    expect(result).to.equal(publicKey)
  })

  it(`getFioBalance`, async () => {
    const result = await fioSdk.genericAction('getFioBalance', {})

    expect(result).to.have.all.keys('balance')
    expect(result.balance).to.be.a('number')
  })

  it(`Register fio domain`, async () => {
    const result = await fioSdk.genericAction('registerFioDomain', { fioDomain: newFioDomain, maxFee: defaultFee })

    expect(result).to.have.all.keys('status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`Renew fio domain`, async () => {
    const result = await fioSdk.genericAction('renewFioDomain', { fioDomain: newFioDomain, maxFee: defaultFee })

    expect(result).to.have.all.keys('status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`setFioDomainVisibility true`, async () => {
    const result = await fioSdk.genericAction('setFioDomainVisibility', {
      fioDomain: newFioDomain,
      isPublic: true,
      maxFee: defaultFee,
      walletFioAddress: ''
    })

    expect(result).to.have.all.keys('status', 'fee_collected', 'expiration')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.expiration).to.be.a('number')
  })

  it(`Register fio address`, async () => {
    const result = await fioSdk.genericAction('registerFioAddress', {
      fioAddress: newFioAddress,
      maxFee: defaultFee
    })

    expect(result).to.have.all.keys('status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`Renew fio address`, async () => {
    const result = await fioSdk.genericAction('renewFioAddress', { fioAddress: newFioAddress, maxFee: defaultFee })

    expect(result).to.have.all.keys('status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`Add public address`, async () => {
    const result = await fioSdk.genericAction('addPublicAddress', {
      fioAddress: newFioAddress,
      tokenCode: fioTokenCode,
      publicAddress: '1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs',
      maxFee: defaultFee,
      walletFioAddress: ''
    })

    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`Add public addresses`, async () => {
    const result = await fioSdk.genericAction('addPublicAddresses', {
      fioAddress: newFioAddress,
      publicAddresses: [
        {
          token_code: fioTokenCode,
          public_address: '1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAg',
        },
        {
          token_code: fioTokenCode,
          public_address: '1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAw',
        }
      ],
      maxFee: defaultFee,
      walletFioAddress: ''
    })

    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`setFioDomainVisibility false`, async () => {
    const result = await fioSdk.genericAction('setFioDomainVisibility', {
      fioDomain: newFioDomain,
      isPublic: false,
      maxFee: defaultFee,
      walletFioAddress: ''
    })

    expect(result).to.have.all.keys('status', 'fee_collected', 'expiration')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.expiration).to.be.a('number')
  })

  it(`setFioDomainVisibility true`, async () => {
    const result = await fioSdk.genericAction('setFioDomainVisibility', {
      fioDomain: newFioDomain,
      isPublic: true,
      maxFee: defaultFee,
      walletFioAddress: ''
    })

    expect(result).to.have.all.keys('status', 'fee_collected', 'expiration')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.expiration).to.be.a('number')
  })

  it(`isAvailable true`, async () => {
    const result = await fioSdk.genericAction('isAvailable', {
      fioName: generateTestingFioAddress(),
    })

    expect(result.is_registered).to.equal(0)
  })

  it(`isAvailable false`, async () => {
    const result = await fioSdk.genericAction('isAvailable', {
      fioName: testFioAddressName
    })

    expect(result.is_registered).to.equal(1)
  })

  it(`getFioBalance for custom fioPublicKey`, async () => {
    const result = await fioSdk.genericAction('getFioBalance', {
      fioPublicKey: publicKey2
    })

    expect(result).to.have.all.keys('balance')
    expect(result.balance).to.be.a('number')
  })

  it(`getFioNames`, async () => {
    const result = await fioSdk.genericAction('getFioNames', { fioPublicKey: publicKey })

    expect(result).to.have.all.keys('fio_domains', 'fio_addresses')
    expect(result.fio_domains).to.be.a('array')
    expect(result.fio_addresses).to.be.a('array')
  })

  it(`getPublicAddress`, async () => {
    const result = await fioSdk.genericAction('getPublicAddress', {
      fioAddress: newFioAddress, tokenCode: fioTokenCode
    })

    expect(result.public_address).to.be.a('string')
  })

  it(`getAbi`, async () => {
    const result = await fioSdk.genericAction('getAbi', { accountName: 'fio.address' })

    expect(result).to.have.all.keys('account_name', 'code_hash', 'abi_hash', 'abi')
    expect(result.account_name).to.be.a('string')
    expect(result.code_hash).to.be.a('string')
    expect(result.abi_hash).to.be.a('string')
    expect(result.abi).to.be.a('string')
  })

  it(`getFee`, async () => {
    const result = await fioSdk.genericAction('getFee', {
      endPoint: 'register_fio_address',
      fioAddress: ''
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`getMultiplier`, async () => {
    const result = await fioSdk.genericAction('getMultiplier', {})

    expect(result).to.be.a('number')
  })

})

describe('Request funds, approve and send', () => {
  const fundsAmount = 3 * BILLION
  let requestId
  const memo = 'testing fund request'

  it(`requestFunds`, async () => {
    const result = await fioSdk2.genericAction('requestFunds', {
      payerFioAddress: testFioAddressName,
      payeeFioAddress: testFioAddressName2,
      payeePublicAddress: testFioAddressName2,
      amount: fundsAmount,
      tokenCode: fioTokenCode,
      memo,
      maxFee: defaultFee,
    })

    requestId = result.fio_request_id
    expect(result).to.have.all.keys('fio_request_id', 'status', 'fee_collected')
    expect(result.fio_request_id).to.be.a('number')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`getPendingFioRequests`, async () => {
    await timeout(4000)
    const result = await fioSdk.genericAction('getPendingFioRequests', {})
    expect(result).to.have.all.keys('requests', 'more')
    expect(result.requests).to.be.a('array')
    expect(result.more).to.be.a('number')
    const pendingReq = result.requests.find(pr => parseInt(pr.fio_request_id) === parseInt(requestId))
    expect(pendingReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'time_stamp', 'content')
    expect(pendingReq.fio_request_id).to.be.a('number')
    expect(pendingReq.fio_request_id).to.equal(requestId)
    expect(pendingReq.payer_fio_address).to.be.a('string')
    expect(pendingReq.payer_fio_address).to.equal(testFioAddressName)
    expect(pendingReq.payee_fio_address).to.be.a('string')
    expect(pendingReq.payee_fio_address).to.equal(testFioAddressName2)
  })

  it(`recordObtData`, async () => {
    const result = await fioSdk.genericAction('recordObtData', {
      fioRequestId: requestId,
      payerFIOAddress: testFioAddressName,
      payeeFIOAddress: testFioAddressName2,
      payerTokenPublicAddress: publicKey,
      payeeTokenPublicAddress: publicKey2,
      amount: fundsAmount,
      tokenCode: fioTokenCode,
      status: 'sent_to_blockchain',
      obtId: '',
      maxFee: defaultFee,
    })
    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`getSentFioRequests`, async () => {
    const result = await fioSdk2.genericAction('getSentFioRequests', {})
    expect(result).to.have.all.keys('requests', 'more')
    expect(result.requests).to.be.a('array')
    expect(result.more).to.be.a('number')
    const pendingReq = result.requests.find(pr => parseInt(pr.fio_request_id) === parseInt(requestId))
    expect(pendingReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
    expect(pendingReq.fio_request_id).to.be.a('number')
    expect(pendingReq.fio_request_id).to.equal(requestId)
    expect(pendingReq.payer_fio_address).to.be.a('string')
    expect(pendingReq.payer_fio_address).to.equal(testFioAddressName)
    expect(pendingReq.payee_fio_address).to.be.a('string')
    expect(pendingReq.payee_fio_address).to.equal(testFioAddressName2)
  })

  it(`Payer getObtData`, async () => {
    await timeout(10000)
    const result = await fioSdk.genericAction('getObtData', {})
    expect(result).to.have.all.keys('obt_data_records', 'more')
    expect(result.obt_data_records).to.be.a('array')
    expect(result.more).to.be.a('number')
    const obtData = result.obt_data_records.find(pr => parseInt(pr.fio_request_id) === parseInt(requestId))
    expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
    expect(obtData.fio_request_id).to.be.a('number')
    expect(obtData.fio_request_id).to.equal(requestId)
    expect(obtData.payer_fio_address).to.be.a('string')
    expect(obtData.payer_fio_address).to.equal(testFioAddressName)
    expect(obtData.payee_fio_address).to.be.a('string')
    expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
  })

  it(`Payee getObtData`, async () => {
    const result = await fioSdk2.genericAction('getObtData', {})
    expect(result).to.have.all.keys('obt_data_records', 'more')
    expect(result.obt_data_records).to.be.a('array')
    expect(result.more).to.be.a('number')
    const obtData = result.obt_data_records.find(pr => parseInt(pr.fio_request_id) === parseInt(requestId))
    expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
    expect(obtData.fio_request_id).to.be.a('number')
    expect(obtData.fio_request_id).to.equal(requestId)
    expect(obtData.payer_fio_address).to.be.a('string')
    expect(obtData.payer_fio_address).to.equal(testFioAddressName)
    expect(obtData.payee_fio_address).to.be.a('string')
    expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
  })

})

describe('Request funds, reject', () => {
  const fundsAmount = 4 * BILLION
  let requestId
  const memo = 'testing fund request'

  it(`requestFunds`, async () => {
    const result = await fioSdk2.genericAction('requestFunds', {
      payerFioAddress: testFioAddressName,
      payeeFioAddress: testFioAddressName2,
      payeePublicAddress: testFioAddressName2,
      amount: fundsAmount,
      tokenCode: fioTokenCode,
      memo,
      maxFee: defaultFee,
    })

    requestId = result.fio_request_id
    expect(result).to.have.all.keys('fio_request_id', 'status', 'fee_collected')
    expect(result.fio_request_id).to.be.a('number')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`getPendingFioRequests`, async () => {
    await timeout(4000)
    const result = await fioSdk.genericAction('getPendingFioRequests', {})

    expect(result).to.have.all.keys('requests', 'more')
    expect(result.requests).to.be.a('array')
    expect(result.more).to.be.a('number')
    const pendingReq = result.requests.find(pr => parseInt(pr.fio_request_id) === parseInt(requestId))
    expect(pendingReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'time_stamp', 'content')
    expect(pendingReq.fio_request_id).to.be.a('number')
    expect(pendingReq.fio_request_id).to.equal(requestId)
    expect(pendingReq.payer_fio_address).to.be.a('string')
    expect(pendingReq.payer_fio_address).to.equal(testFioAddressName)
    expect(pendingReq.payee_fio_address).to.be.a('string')
    expect(pendingReq.payee_fio_address).to.equal(testFioAddressName2)
  })

  it(`rejectFundsRequest`, async () => {
    const result = await fioSdk.genericAction('rejectFundsRequest', {
      fioRequestId: requestId,
      maxFee: defaultFee,
    })

    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

})

describe('Transfer tokens', () => {
  const fundsAmount = BILLION
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
    fioBalanceAfter = result.balance
    expect(fundsAmount).to.equal(fioBalanceAfter - fioBalance)
  })
})

describe('Record obt data, check', () => {
  const obtId = generateObtId()
  const fundsAmount = 4500000000

  it(`recordObtData`, async () => {
    const result = await fioSdk.genericAction('recordObtData', {
      fioRequestId: '',
      payerFIOAddress: testFioAddressName,
      payeeFIOAddress: testFioAddressName2,
      payerTokenPublicAddress: publicKey,
      payeeTokenPublicAddress: publicKey2,
      amount: fundsAmount,
      tokenCode: fioTokenCode,
      status: 'sent_to_blockchain',
      obtId,
      maxFee: defaultFee,
    })
    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`Payer getObtData`, async () => {
    await timeout(4000)
    const result = await fioSdk.genericAction('getObtData', {})
    expect(result).to.have.all.keys('obt_data_records', 'more')
    expect(result.obt_data_records).to.be.a('array')
    expect(result.more).to.be.a('number')
    const obtData = result.obt_data_records.find(pr => pr.content.obt_id === obtId)
    expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
    expect(obtData.content.obt_id).to.be.a('string')
    expect(obtData.content.obt_id).to.equal(obtId)
    expect(obtData.payer_fio_address).to.be.a('string')
    expect(obtData.payer_fio_address).to.equal(testFioAddressName)
    expect(obtData.payee_fio_address).to.be.a('string')
    expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
  })

  it(`Payee getObtData`, async () => {
    const result = await fioSdk2.genericAction('getObtData', {})
    expect(result).to.have.all.keys('obt_data_records', 'more')
    expect(result.obt_data_records).to.be.a('array')
    expect(result.more).to.be.a('number')
    const obtData = result.obt_data_records.find(pr => pr.content.obt_id === obtId)
    expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
    expect(obtData.content.obt_id).to.be.a('string')
    expect(obtData.content.obt_id).to.equal(obtId)
    expect(obtData.payer_fio_address).to.be.a('string')
    expect(obtData.payer_fio_address).to.equal(testFioAddressName)
    expect(obtData.payee_fio_address).to.be.a('string')
    expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
  })
})
