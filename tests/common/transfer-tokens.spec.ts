import { expect } from 'chai'
import { FIOSDK } from '../../src/FIOSDK'
import { defaultFee } from '../constants'
import { timeout } from '../utils'

export const TransferTokensTests = ({
  fioSdk,
  fioSdk2,
  publicKey2,
}: {
  fioSdk: FIOSDK,
  fioSdk2: FIOSDK,
  publicKey2: string
}) => describe('Transfer tokens', () => {
  const fundsAmount = FIOSDK.SUFUnit
  let fioBalance = 0
  let fioBalanceAfter = 0

  it(`Check balance before transfer`, async () => {
    const result = await fioSdk2.genericAction('getFioBalance', {})

    fioBalance = result.balance
  })

  it(`Transfer tokens`, async () => {
    const result = await fioSdk.genericAction('transferTokens', {
      amount: fundsAmount,
      maxFee: defaultFee,
      payeeFioPublicKey: publicKey2,
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
});
