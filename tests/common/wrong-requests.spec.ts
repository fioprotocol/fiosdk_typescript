import { expect } from 'chai';
import 'mocha';
import { FIOSDK } from '../../src/FIOSDK';
import { ErrorType } from '../utils';

const wrongBaseUrl = 'https://wrong-url-test.test.com/'
const wrongBaseUrl2 = 'https://wrong-url-test-2.com/'


export const WrongRequestsTests = ({ fioSdk, baseUrls, fioSdkWithWrongBaseUrl }: { fioSdk: FIOSDK, baseUrls: string[], fioSdkWithWrongBaseUrl: FIOSDK }) =>
  describe('Testing request timeout on wrong url and 40x errors', () => {
    const baseUrlsList = [
        ...baseUrls,
        'https://fiotestnet.blockpane.com/v1/',
        'https://fio-testnet.genereos.io/v1/'
    ];

    fioSdk.setApiUrls(baseUrlsList)

    it('Should succeed with valid endpoint after failed attempts', async () => {
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

    it('Should move failed url to the end of the list', async () => {
      const baseUrlsToSet = [wrongBaseUrl, ...baseUrls];

      fioSdkWithWrongBaseUrl.setApiUrls(baseUrlsToSet)

      // Should run with the first url from list
      await fioSdkWithWrongBaseUrl.genericAction('getFioBalance', {})

      // Should run with the next url from list from start
      await fioSdkWithWrongBaseUrl.genericAction('getFioBalance', {})

      expect(wrongBaseUrl).to.eq(fioSdkWithWrongBaseUrl.config.baseUrls[fioSdkWithWrongBaseUrl.config.baseUrls.length - 1])
    })

    it(`Get Fio Balance with wrong base url`, async () => {
      try {
        fioSdkWithWrongBaseUrl.setApiUrls([wrongBaseUrl])
        await fioSdkWithWrongBaseUrl.genericAction('getFioBalance', {})
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).to.match(/request_timeout|ENOTFOUND/)
        }
      }
    })

    it(`Get Fio Balance with 2 wrong base urls`, async () => {
      try {
        fioSdkWithWrongBaseUrl.setApiUrls([wrongBaseUrl, wrongBaseUrl2])
        await fioSdkWithWrongBaseUrl.genericAction('getFioBalance', {})
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).to.match(/request_timeout|ENOTFOUND/)
        }
      }
    })

    it(`Get Fio Balance with one wrong and correct base urls`, async () => {
      fioSdkWithWrongBaseUrl.setApiUrls([wrongBaseUrl, ...baseUrls])

      const result = await fioSdkWithWrongBaseUrl.genericAction(
        'getFioBalance',
        {},
      )
      expect(result).to.have.all.keys(
        'balance',
        'available',
        'staked',
        'srps',
        'roe',
      )
      expect(result.balance).to.be.a('number')
      expect(result.available).to.be.a('number')
      expect(result.staked).to.be.a('number')
      expect(result.srps).to.be.a('number')
      expect(result.roe).to.be.a('string')
    })

    it(`Get Fio Balance with one correct and wrong base urls`, async () => {
      fioSdkWithWrongBaseUrl.setApiUrls([...baseUrls, wrongBaseUrl])

      const result = await fioSdkWithWrongBaseUrl.genericAction(
        'getFioBalance',
        {},
      )
      expect(result).to.have.all.keys(
        'balance',
        'available',
        'staked',
        'srps',
        'roe',
      )
      expect(result.balance).to.be.a('number')
      expect(result.available).to.be.a('number')
      expect(result.staked).to.be.a('number')
      expect(result.srps).to.be.a('number')
      expect(result.roe).to.be.a('string')
    })

    it(`Get Fio Balance with one wrong, correct and wrong base urls`, async () => {
      fioSdkWithWrongBaseUrl.setApiUrls([
        wrongBaseUrl,
        baseUrls[0],
        wrongBaseUrl2,
      ])

      const result = await fioSdkWithWrongBaseUrl.genericAction(
        'getFioBalance',
        {},
      )
      expect(result).to.have.all.keys(
        'balance',
        'available',
        'staked',
        'srps',
        'roe',
      )
      expect(result.balance).to.be.a('number')
      expect(result.available).to.be.a('number')
      expect(result.staked).to.be.a('number')
      expect(result.srps).to.be.a('number')
      expect(result.roe).to.be.a('string')
    })

    it(`Make removePublicAddresses request with wrong parameter and correct base url`, async () => {
      try {
        await fioSdk.genericAction('removePublicAddresses', {
          fioAddress: '',
          maxFee: 600000000,
          publicAddresses: [
            {
              chain_code: 'BCH',
              public_address:
                'bitcoincash:qzf8zha74ahdh9j0xnwlffdn0zuyaslx3c90q7n9g9',
              token_code: 'BCH',
            },
            {
              chain_code: 'DASH',
              public_address: 'XyCyPKzTWvW2XdcYjPaPXGQDCGk946ywEv',
              token_code: 'DASH',
            },
          ],
        })
      } catch (error) {
        const err = error as ErrorType;

        expect(err.message).to.equal('Validation error');
        expect(err.list[0].message).to.equal('fioAddress must have a length between 3 and 64.')
      }
    })

    it(`Be sure that fiosdk instance is not affected by wrong base urls instance`, () => {
      expect(fioSdk.config.baseUrls.includes(wrongBaseUrl)).to.be.false
      expect(fioSdk.config.baseUrls.includes(wrongBaseUrl2)).to.be.false
      expect(fioSdkWithWrongBaseUrl.config.baseUrls.includes(wrongBaseUrl)).to.be.true
    })
});
