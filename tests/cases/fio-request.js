const { expect } = require('chai')
const { SignedTransaction } = require('../../lib/transactions/signed/SignedTransaction')
const { EndPoint } = require('../../lib/entities/EndPoint')
const { Constants } = require('../../lib/utils/constants')

const fioRequest = ({
  testFioAddressName,
  testFioAddressName2,
  fioChainCode,
  fioTokenCode,
  defaultFee,
  timeout
}) => {
  const fundsAmount = 3
  let requestId
  const memo = 'testing fund request'

  it(`getFee for requestFunds`, async () => {
    const result = await fioSdk.getFee(EndPoint.newFundsRequest, testFioAddressName2)

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`requestFunds`, async () => {
    const content = {
      payer_fio_public_key: fioSdk.publicKey,
      payee_public_address: fioSdk2.publicKey,
      amount: `${fundsAmount}`,
      chain_code: fioChainCode,
      token_code: fioTokenCode,
      memo: '',
      hash: '',
      offline_url: '',
    }
    const trx = new SignedTransaction()
    const result = await fioSdk2.pushTransaction(Constants.actionNames.newfundsreq, {
      payer_fio_address: testFioAddressName,
      payee_fio_address: testFioAddressName2,
      max_fee: defaultFee,
      content: trx.getCipherContent(Constants.CipherContentTypes.new_funds_content, content, fioSdk2.privateKey, fioSdk.publicKey)
    }, {
      account: Constants.abiAccounts.fio_reqobt
    })
    requestId = result.fio_request_id
    expect(result).to.have.all.keys('fio_request_id', 'status', 'fee_collected')
    expect(result.fio_request_id).to.be.a('number')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`getPendingFioRequests`, async () => {
    await timeout(4000)
    const result = await fioSdk.get(EndPoint.pendingFioRequests, {
      fio_public_key: fioSdk.publicKey
    }, {
      decrypt: {
        key: 'requests',
        contentType: Constants.CipherContentTypes.new_funds_content
      }
    })
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
    const content = {
      payer_public_address: fioSdk.publicKey,
      payee_public_address: fioSdk2.publicKey,
      amount: `${fundsAmount}`,
      chain_code: fioChainCode,
      token_code: fioTokenCode,
      status: Constants.TrxStatuses.sent_to_blockchain,
      obt_id: '',
      memo: '',
      hash: '',
      offline_url: ''
    }
    const trx = new SignedTransaction()
    const result = await fioSdk.pushTransaction(Constants.actionNames.recordobt, {
      payer_fio_address: testFioAddressName,
      payee_fio_address: testFioAddressName2,
      content: trx.getCipherContent(Constants.CipherContentTypes.record_obt_data_content, content, fioSdk.privateKey, fioSdk2.publicKey),
      fio_request_id: requestId,
      max_fee: defaultFee,
    }, {
      account: Constants.abiAccounts.fio_reqobt
    })
    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`getSentFioRequests`, async () => {
    const result = await fioSdk2.get(EndPoint.sentFioRequests, {
      fio_public_key: fioSdk2.publicKey
    }, {
      decrypt: {
        key: 'requests',
        contentType: Constants.CipherContentTypes.new_funds_content
      }
    })
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
    const result = await fioSdk.get(
      EndPoint.getObtData, {
        fio_public_key: fioSdk.publicKey
      }, {
        decrypt: {
          key: 'obt_data_records',
          contentType: Constants.CipherContentTypes.record_obt_data_content
        }
      }
    )
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
    const result = await fioSdk2.get(
      EndPoint.getObtData, {
        fio_public_key: fioSdk2.publicKey
      }, {
        decrypt: {
          key: 'obt_data_records',
          contentType: Constants.CipherContentTypes.record_obt_data_content
        }
      }
    )
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
}

module.exports = {
  fioRequest
}
