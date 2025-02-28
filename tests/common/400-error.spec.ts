import chai from 'chai';
import 'mocha';
import { FIOSDK } from '../../src/FIOSDK';

const { expect } = chai;


export const test400Error = ({ fioSdk, baseUrls }: { fioSdk: FIOSDK, baseUrls: string[] }) =>
  describe('400 Error handling', () => {
    const baseUrlsList = [
        ...baseUrls,
        'https://fiotestnet.blockpane.com/v1/',
        'https://fio-api-testnet.eosiomadrid.io/v1/'
    ];

    fioSdk.setApiUrls(baseUrlsList)

    it('should succeed with valid endpoint after failed attempts', async () => {
      const fakeFioHandle = 'abracadabra@fakedomain';
  
      try {
        await fioSdk.genericAction('getPublicAddress', {
          chainCode: 'FIO', fioAddress: fakeFioHandle, tokenCode: 'FIO',
        })
      } catch (error) {
        const err = error as Error;
        expect(err.message).to.include(baseUrlsList[0])
      }
    });
});
