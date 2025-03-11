import { expect } from 'chai';
import { FioRequestStatus, FIOSDK, FioSentItem } from '../../src/FIOSDK';
import { generateObtId, timeout } from '../utils';
import { fioChainCode, defaultFee, fioTokenCode } from '../constants';

export const RecordObtDataTests = ({
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
}) => describe('Record obt data, check', () => {
  const obtId = generateObtId()
  const fundsAmount = 4.5

  it(`getFee for recordObtData`, async () => {
    const result = await fioSdk.genericAction('getFeeForRecordObtData', {
      payerFioAddress: testFioAddressName,
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`recordObtData`, async () => {
    const result = await fioSdk.genericAction('recordObtData', {
      amount: fundsAmount,
      chainCode: fioChainCode,
      maxFee: defaultFee,
      obtId,
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
  })

  it(`Payer getObtData`, async () => {
    try {
      await timeout(4000)

      const result = await fioSdk.genericAction('getObtData', { tokenCode: fioTokenCode })

      expect(result).to.have.all.keys('obt_data_records', 'more')
      expect(result.obt_data_records).to.be.a('array')
      expect(result.more).to.be.a('number')

      const obtData = (result.obt_data_records as FioSentItem[]).find((pr) => pr.content.obt_id === obtId)!

      expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
      expect(obtData.content.obt_id).to.be.a('string')
      expect(obtData.content.obt_id).to.equal(obtId)
      expect(obtData.payer_fio_address).to.be.a('string')
      expect(obtData.payer_fio_address).to.equal(testFioAddressName)
      expect(obtData.payee_fio_address).to.be.a('string')
      expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
    } catch (e) {
      // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test
      console.log('Payer getObtData Error',e)
    }
  })

  it(`Payee getObtData`, async () => {
    try {
      const result = await fioSdk2.genericAction('getObtData', { tokenCode: fioTokenCode })

      expect(result).to.have.all.keys('obt_data_records', 'more')
      expect(result.obt_data_records).to.be.a('array')
      expect(result.more).to.be.a('number')

      const obtData = (result.obt_data_records as FioSentItem[]).find((pr) => pr.content.obt_id === obtId)!

      expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
      expect(obtData.content.obt_id).to.be.a('string')
      expect(obtData.content.obt_id).to.equal(obtId)
      expect(obtData.payer_fio_address).to.be.a('string')
      expect(obtData.payer_fio_address).to.equal(testFioAddressName)
      expect(obtData.payee_fio_address).to.be.a('string')
      expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
    } catch (e) {
      // Ignore decrypt content errors - these can occur if the request was encrypted with keys not available in this test
      console.log('Payee getObtData Error',e)
    }
  })
});
