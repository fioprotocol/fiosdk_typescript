require('mocha')
const { expect } = require('chai')
const { FIOSDK } = require('../lib/FIOSDK')

fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  const res = await fetch(uri, opts)
  return res.json()
}

let privateKey, publicKey, privateKey2, publicKey2, testFioAddressName, testFioAddressName2
const mnemonic = 'property follow talent guilt uncover someone gain powder urge slot taxi sketch'
const mnemonic2 = 'round work clump little air glue lemon gravity shed charge assault orbit'

/**
 * Urls required
 */
const baseUrl = ''
const mockBaseUrl = ''

/**
 * Address to request funds to be able make all calls with fee
 */
const faucetFioAddress = ''
const faucetPublicAddress = ''

const fioTokenCode = 'FIO'
const fundAmount = 250000000000
const defaultFee = 30000000000
const fundReceiveTimout = 60000

let fioSdk, fioSdk2

const generateTestingFioAddress = (customDomain = 'edge') => {
  return `testing${Date.now()}:${customDomain}`
}

const generateTestingFioDomain = () => {
  return `testing-domain-${Date.now()}`
}

const timeout = async (ms) => {
  await new Promise(resolve => {
    setTimeout(resolve, ms)
  })
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
    fetchJson,
    mockBaseUrl
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
    fetchJson,
    mockBaseUrl
  )
  testFioAddressName2 = generateTestingFioAddress()

  try {
    await fioSdk.registerFioNameOnBehalfOfUser(testFioAddressName, publicKey)
    await fioSdk.registerFioNameOnBehalfOfUser(testFioAddressName2, publicKey2)
  } catch (e) {
    console.log(e);
  }
  const ress = await fioSdk.requestFunds(faucetFioAddress, testFioAddressName, testFioAddressName, fundAmount, fioTokenCode, '', defaultFee, publicKey)
  await timeout(fundReceiveTimout)
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
    const result = await fioSdk.genericAction('registerFioDomain', { FioDomain: newFioDomain, maxFee: defaultFee })
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
    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
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

  it(`setFioDomainVisibility false`, async () => {
    const result = await fioSdk.genericAction('setFioDomainVisibility', {
      fioDomain: newFioDomain,
      isPublic: false,
      maxFee: defaultFee,
      walletFioAddress: ''
    })
    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`setFioDomainVisibility true`, async () => {
    const result = await fioSdk.genericAction('setFioDomainVisibility', {
      fioDomain: newFioDomain,
      isPublic: true,
      maxFee: defaultFee,
      walletFioAddress: ''
    })

    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
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
  const fundsAmount = 3000000000
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

  it(`recordSend`, async () => {
    const result = await fioSdk.genericAction('recordSend', {
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

})

describe('Request funds, reject', () => {
  const fundsAmount = 4000000000
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
  const fundsAmount = 1000000000
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

    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`Check balance and balance change`, async () => {
    await timeout(10000)
    const result = await fioSdk2.genericAction('getFioBalance', {})
    fioBalanceAfter = result.balance
    expect(fundsAmount).to.equal(fioBalanceAfter - fioBalance)
  })
})
