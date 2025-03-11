import { expect } from 'chai';
import { Account, Action, FIOSDK, TransactionResponse } from '../../src/FIOSDK';
import { defaultFee } from '../constants';

export const VoteBlockProducerTests = ({
  fioSdk,
  publicKey,
  proxyTpId,
  testFioAddressName
}: {
  fioSdk: FIOSDK,
  publicKey: string,
  proxyTpId: string,
  testFioAddressName: string
}) => describe('Testing vote block producer', () => {
  it(`fioSdk votes for Block Producer`, async () => {
    const accountName = FIOSDK.accountHash(publicKey).accountnm

    try {
      const result = await fioSdk.genericAction('pushTransaction', {
        account: Account.eosio,
        action: Action.voteProducer,
        data: {
          actor: accountName,
          fio_address: testFioAddressName,
          max_fee: defaultFee,
          producers: [proxyTpId],
        },
      }) as TransactionResponse

      expect(result.status).to.equal('OK')
    } catch (err) {
      console.log('Error: ', err)
      expect(err).to.equal('null')
    }
  })
});
