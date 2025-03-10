import { expect } from 'chai';
import { FIOSDK } from '../../src/FIOSDK';

export const StakeTokensTests = ({
  fioSdk,
  publicKey,
  testFioAddressName
}: {
  fioSdk: FIOSDK,
  publicKey: string,
  testFioAddressName: string
}) => describe('Staking tests', () => {
  let stakedBalance = 0
  const stakeAmount = FIOSDK.amountToSUF(5)
  const unStakeAmount = FIOSDK.amountToSUF(2)

  it(`Stake`, async () => {
    try {
      const { staked } = await fioSdk.genericAction('getFioBalance', {})
      stakedBalance = staked

      const result = await fioSdk.genericAction('stakeFioTokens', {
        amount: stakeAmount,
        fioAddress: testFioAddressName,
        technologyProviderId: '',
      })

      expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
      expect(result.status).to.be.a('string')
      expect(result.fee_collected).to.be.a('number')
      expect(result.block_num).to.be.a('number')
      expect(result.transaction_id).to.be.a('string')
    } catch (e) {
      console.log(e)
    }
  })

  it(`Check staked amount`, async () => {
    const result = await fioSdk.genericAction('getFioBalance', {})

    expect(result.staked).to.equal(stakedBalance + stakeAmount)
  })

  it(`Unstake`, async () => {
    const result = await fioSdk.genericAction('unStakeFioTokens', {
      amount: unStakeAmount,
      fioAddress: testFioAddressName,
      technologyProviderId: '',
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`Check locks`, async () => {
    const result = await fioSdk.genericAction('getLocks', { fioPublicKey: publicKey })

    expect(result).to.have.all.keys('lock_amount', 'remaining_lock_amount', 'time_stamp', 'payouts_performed', 'can_vote', 'unlock_periods')
    expect(result.lock_amount).to.be.a('number')
    expect(result.remaining_lock_amount).to.be.a('number')
    expect(result.time_stamp).to.be.a('number')
    expect(result.payouts_performed).to.be.a('number')
    expect(result.can_vote).to.be.a('number')
    expect(result.unlock_periods[0].amount).to.be.a('number')
    expect(result.unlock_periods[0].duration).to.be.a('number')
  })

  it(`Check staked amount after unstake`, async () => {
    const result = await fioSdk.genericAction('getFioBalance', {})

    expect(result.staked).to.equal(stakedBalance + stakeAmount - unStakeAmount)
  })
});
