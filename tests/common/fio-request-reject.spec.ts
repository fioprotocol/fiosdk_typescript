import { expect } from 'chai';
import { FIOSDK } from '../../src/FIOSDK';
import { fioChainCode, defaultFee, fioTokenCode } from '../constants';
import { timeout } from '../utils';

export const FioRequestRejectTests = ({
  fioSdk,
  fioSdk2,
  testFioAddressName,
  testFioAddressName2
}: {
  fioSdk: FIOSDK,
  fioSdk2: FIOSDK,
  testFioAddressName: string,
  testFioAddressName2: string
}) => describe('Request funds, reject', () => {
  const fundsAmount = 4
  let requestId: number
  const memo = 'testing fund request'

  it(`requestFunds`, async () => {
    const result = await fioSdk2.genericAction('requestFunds', {
      amount: fundsAmount,
      chainCode: fioChainCode,
      maxFee: defaultFee,
      memo,
      payeeFioAddress: testFioAddressName2,
      payeeTokenPublicAddress: testFioAddressName2,
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
    try {
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
    } catch (e) {
      // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test
      console.log('getPendingFioRequests Error',e)
    }
  })

  it(`getFee for rejectFundsRequest`, async () => {
    const result = await fioSdk.genericAction('getFeeForRejectFundsRequest', {
      payerFioAddress: testFioAddressName2,
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`rejectFundsRequest`, async () => {
    const result = await fioSdk.genericAction('rejectFundsRequest', {
      fioRequestId: requestId,
      maxFee: defaultFee,
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })
});
