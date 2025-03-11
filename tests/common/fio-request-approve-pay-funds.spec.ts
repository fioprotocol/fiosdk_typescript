import { expect } from 'chai';
import { FioRequestStatus, FIOSDK, FioSentItem, FioSentItemContent } from '../../src/FIOSDK';
import { fioChainCode, fioTokenCode, defaultFee } from '../constants';
import { timeout } from '../utils';

export const FioRequestApproveAndPayFundsTests = ({
  fioSdk,
  fioSdk2,
  publicKey,
  publicKey2,
  testFioAddressName,
  testFioAddressName2
}: {
  fioSdk: FIOSDK,
  fioSdk2: FIOSDK,
  publicKey: string,
  publicKey2: string,
  testFioAddressName: string,
  testFioAddressName2: string
}) => describe('Request funds, approve and send', () => {
  const fundsAmount = 3
  let requestId: number
  const memo = 'testing fund request'

  it(`getFee for requestFunds`, async () => {
    const result = await fioSdk.genericAction('getFeeForNewFundsRequest', {
      payeeFioAddress: testFioAddressName2,
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`requestFunds`, async () => {
    const result = await fioSdk2.genericAction('requestFunds', {
      amount: fundsAmount,
      chainCode: fioChainCode,
      maxFee: defaultFee,
      memo,
      payeeFioAddress: testFioAddressName2,
      payeeTokenPublicAddress: fioSdk2.publicKey,
      payerFioAddress: testFioAddressName,
      tokenCode: fioTokenCode,
    })

    requestId = result.fio_request_id
    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fio_request_id', 'fee_collected')
    expect(result.fio_request_id).to.be.a('number')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getPendingFioRequests`, async () => {
    await timeout(4000)
    const result = await fioSdk.genericAction('getPendingFioRequests', {})
    expect(result).to.have.all.keys('requests', 'more')
    expect(result.requests).to.be.a('array')
    expect(result.more).to.be.a('number')
    const pendingReq = result.requests.find((pr) => pr.fio_request_id === requestId)!
    expect(pendingReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'time_stamp', 'content')
    expect(pendingReq.fio_request_id).to.be.a('number')
    expect(pendingReq.fio_request_id).to.equal(requestId)
    expect(pendingReq.payer_fio_address).to.be.a('string')
    expect(pendingReq.payer_fio_address).to.equal(testFioAddressName)
    expect(pendingReq.payee_fio_address).to.be.a('string')
    expect(pendingReq.payee_fio_address).to.equal(testFioAddressName2)
    expect(pendingReq.content.memo).to.be.equal(memo)
  })

  it(`getSentFioRequests`, async () => {
    const result = await fioSdk2.genericAction('getSentFioRequests', {})
    expect(result).to.have.all.keys('requests', 'more')
    expect(result.requests).to.be.a('array')
    expect(result.more).to.be.a('number')
    const sentReq = result.requests.find((pr) => pr.fio_request_id === requestId) as FioSentItem
    expect(sentReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
    expect(sentReq.fio_request_id).to.be.a('number')
    expect(sentReq.fio_request_id).to.equal(requestId)
    expect(sentReq.payer_fio_address).to.be.a('string')
    expect(sentReq.payer_fio_address).to.equal(testFioAddressName)
    expect(sentReq.payee_fio_address).to.be.a('string')
    expect(sentReq.payee_fio_address).to.equal(testFioAddressName2)
    expect(sentReq.content.memo).to.be.equal(memo)
  })

  it(`recordObtData`, async () => {
    try {
      await fioSdk.genericAction('transferTokens', {
        amount: fundsAmount,
        maxFee: defaultFee,
        payeeFioPublicKey: publicKey2,
      })
      const result = await fioSdk.genericAction('recordObtData', {
        amount: fundsAmount,
        chainCode: fioChainCode,
        fioRequestId: requestId,
        maxFee: defaultFee,
        obtId: '',
        payeeFioAddress: testFioAddressName2,
        payeeTokenPublicAddress: publicKey2,
        payerFioAddress: testFioAddressName,
        payerTokenPublicAddress: publicKey,
        status: FioRequestStatus.sentToBlockchain,
        tokenCode: fioTokenCode,
      })
      expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
      expect(result.status).to.be.a('string')
      expect(result.fee_collected).to.be.a('number')
      expect(result.block_num).to.be.a('number')
      expect(result.transaction_id).to.be.a('string')
    } catch (err) {
      expect(err).to.equal(null)
    }
  })

  it(`getReceivedFioRequests`, async () => {
    await timeout(4000)
    const result = await fioSdk.genericAction('getReceivedFioRequests', {})
    expect(result).to.have.all.keys('requests', 'more')
    expect(result.requests).to.be.a('array')
    expect(result.more).to.be.a('number')
    const receivedReq = result.requests.find((pr) => pr.fio_request_id === requestId)!
    expect(receivedReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'time_stamp', 'content', 'status')
    expect(receivedReq.fio_request_id).to.be.a('number')
    expect(receivedReq.fio_request_id).to.equal(requestId)
    expect(receivedReq.payer_fio_address).to.be.a('string')
    expect(receivedReq.payer_fio_address).to.equal(testFioAddressName)
    expect(receivedReq.payee_fio_address).to.be.a('string')
    expect(receivedReq.payee_fio_address).to.equal(testFioAddressName2)
    expect((receivedReq.content as FioSentItemContent).memo).to.be.equal(memo)
  })

  it(`Payer getObtData`, async () => {
    await timeout(10000)
    const result = await fioSdk.genericAction('getObtData', {})
    expect(result).to.have.all.keys('obt_data_records', 'more')
    expect(result.obt_data_records).to.be.a('array')
    expect(result.more).to.be.a('number')
    const obtData = result.obt_data_records.find((pr) => pr.fio_request_id === requestId)!
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
    const obtData = result.obt_data_records.find((pr) => pr.fio_request_id === requestId)!
    expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
    expect(obtData.fio_request_id).to.be.a('number')
    expect(obtData.fio_request_id).to.equal(requestId)
    expect(obtData.payer_fio_address).to.be.a('string')
    expect(obtData.payer_fio_address).to.equal(testFioAddressName)
    expect(obtData.payee_fio_address).to.be.a('string')
    expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
  })
});
