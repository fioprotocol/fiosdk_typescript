const { expect } = require('chai')
const { EndPoint } = require('../../lib/entities/EndPoint')
const { SignedTransaction } = require('../../lib/transactions/signed/SignedTransaction')
const { Constants } = require('../../lib/utils/constants')

const cancelRequest = ({
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

  it(`requestFunds`, async () => {
    const content = {
      payer_fio_public_key: fioSdk.publicKey,
      payee_public_address: fioSdk2.publicKey,
      amount: `${fundsAmount}`,
      chain_code: fioChainCode,
      token_code: fioTokenCode,
      memo,
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

  it(`cancel request`, async () => {
    try{
      const result = await fioSdk2.pushTransaction(Constants.actionNames.cancelfndreq, {
        fio_request_id: requestId,
        max_fee: defaultFee
      }, {
        account: Constants.abiAccounts.fio_reqobt
      })
      expect(result).to.have.all.keys('status', 'fee_collected')
      expect(result.status).to.be.a('string')
      expect(result.fee_collected).to.be.a('number')
    } catch (e) {
      console.log(e);
    }
  })


  it(`getCancelledFioRequests`, async () => {
    try{
      await timeout(4000)
      const result = await fioSdk2.get(EndPoint.cancelledFioRequests, {
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
      expect(pendingReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'time_stamp', 'content', 'status')
      expect(pendingReq.fio_request_id).to.be.a('number')
      expect(pendingReq.fio_request_id).to.equal(requestId)
      expect(pendingReq.payer_fio_address).to.be.a('string')
      expect(pendingReq.payer_fio_address).to.equal(testFioAddressName)
      expect(pendingReq.payee_fio_address).to.be.a('string')
      expect(pendingReq.payee_fio_address).to.equal(testFioAddressName2)
    } catch (e) {
      console.log(e);
    }
  })
}

module.exports = {
  cancelRequest
}
