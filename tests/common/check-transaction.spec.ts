import { expect } from 'chai';
import { EndPoint } from '../../src/entities';
import { FIOSDK } from '../../src/FIOSDK';
import { fioChainCode, defaultFee, fioTokenCode } from '../constants';

export const CheckTransactionTests = ({
  fioSdk2,
  testFioAddressName,
  testFioAddressName2
}: {
  fioSdk2: FIOSDK,
  testFioAddressName: string,
  testFioAddressName2: string
}) => describe('Check prepared transaction', () => {
  it(`requestFunds prepared transaction`, async () => {
    fioSdk2.setSignedTrxReturnOption(true)

    const preparedTrx = await fioSdk2.genericAction('requestFunds', {
      amount: 200000,
      chainCode: fioChainCode,
      maxFee: defaultFee,
      memo: 'prepared transaction',
      payeeFioAddress: testFioAddressName2,
      payeeTokenPublicAddress: testFioAddressName2,
      payerFioAddress: testFioAddressName,
      tokenCode: fioTokenCode,
    })
    const result = await fioSdk2.executePreparedTrx(EndPoint.newFundsRequest, preparedTrx)

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fio_request_id', 'fee_collected')
    expect(result.transaction_id).to.be.a('string')
    expect(result.block_num).to.be.a('number')
    expect(result.fio_request_id).to.be.a('number')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')

    fioSdk2.setSignedTrxReturnOption(false)
  })
});
