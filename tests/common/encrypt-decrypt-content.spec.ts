import { expect } from 'chai';
import { ContentType } from '../../src/entities';
import { FIOSDK } from '../../src/FIOSDK';
import { fetchJson } from '../utils';

export const EncryptDecryptContentTests = ({ baseUrls }: { baseUrls: string[] }) => describe('Encrypting/Decrypting', () => {
  const alicePrivateKey = '5J35xdLtcPvDASxpyWhNrR2MfjSZ1xjViH5cvv15VVjqyNhiPfa'
  const alicePublicKey = 'FIO6NxZ7FLjjJuHGByJtNJQ1uN1P5X9JJnUmFW3q6Q7LE7YJD4GZs'
  const bobPrivateKey = '5J37cXw5xRJgE869B5LxC3FQ8ZJECiYnsjuontcHz5cJsz5jhb7'
  const bobPublicKey = 'FIO4zUFC29aq8uA4CnfNSyRZCnBPya2uQk42jwevc3UZ2jCRtepVZ'

  const nonPartyPrivateKey = '5HujRtqceTPo4awwHAEdHRTWdMTgA6s39dJjwWcjhNdSjVWUqMk'
  const nonPartyPublicKey = 'FIO5mh1UqE5v9TKdYm2Ro6JXCXpSxj1Sm4vKUeydaLd7Cu5aqiSSp'

  const fioSDKBob = new FIOSDK(
    bobPrivateKey,
    bobPublicKey,
    baseUrls,
    fetchJson,
  )

  it(`Encrypt/Decrypt - Request New Funds`, async () => {
    const payeeTokenPublicAddress = bobPublicKey
    const amount = 1.57
    const chainCode = 'FIO'
    const tokenCode = 'FIO'
    const memo = 'testing encryption does it work?'
    const hash = ''
    const offlineUrl = ''

    const content = {
      amount,
      chain_code: chainCode,
      hash,
      memo,
      offline_url: offlineUrl,
      payee_public_address: payeeTokenPublicAddress,
      token_code: tokenCode,
    }

    const cipherContent = fioSDKBob.transactions.getCipherContent(
      ContentType.newFundsContent,
      content,
      bobPrivateKey,
      alicePublicKey,
    )
    expect(cipherContent).to.be.a('string')

    const uncipherContent = fioSDKBob.transactions.getUnCipherContent(
      ContentType.newFundsContent,
      cipherContent,
      alicePrivateKey,
      bobPublicKey,
    )
    expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

    // same party, ensure cannot decipher
    try {
      const uncipherContentSameParty = fioSDKBob.transactions.getUnCipherContent(
        ContentType.newFundsContent,
        cipherContent,
        alicePrivateKey,
        alicePublicKey,
      )
      expect(uncipherContentSameParty.payee_public_address).to.not.equal(bobPublicKey)
    } catch (e) {
      // empty
    }

    // non party, ensure cannot decipher
    try {
      const uncipherContentNonParty = fioSDKBob.transactions.getUnCipherContent(
        ContentType.newFundsContent,
        cipherContent,
        nonPartyPrivateKey,
        bobPublicKey,
      )
      expect(uncipherContentNonParty.payee_public_address).to.not.equal(bobPublicKey)
    } catch (e) {
      // empty
    }

    try {
      const uncipherContentNonPartyA = fioSDKBob.transactions.getUnCipherContent(
        ContentType.newFundsContent,
        cipherContent,
        bobPrivateKey,
        nonPartyPublicKey,
      )
      expect(uncipherContentNonPartyA.payee_public_address).to.not.equal(bobPublicKey)
    } catch (e) {
      // empty
    }

  })

  it(`Encrypt/Decrypt - RecordObtData`, async () => {
    const payerTokenPublicAddress = alicePublicKey
    const payeeTokenPublicAddress = bobPublicKey
    const amount = 1.57
    const chainCode = 'FIO'
    const tokenCode = 'FIO'
    const memo = 'testing TypeScript SDK encryption does it work?'
    const hash = ''
    const offlineUrl = ''

    const content = {
      amount,
      chain_code: chainCode,
      hash,
      memo,
      obt_id: '',
      offline_url: offlineUrl,
      payee_public_address: payeeTokenPublicAddress,
      payer_public_address: payerTokenPublicAddress,
      status: '',
      token_code: tokenCode,
    }

    const cipherContent = fioSDKBob.transactions.getCipherContent(
      ContentType.recordObtDataContent,
      content,
      bobPrivateKey,
      alicePublicKey,
    )
    expect(cipherContent).to.be.a('string')

    const uncipherContent = fioSDKBob.transactions.getUnCipherContent(
      ContentType.recordObtDataContent,
      cipherContent,
      alicePrivateKey,
      bobPublicKey,
    )
    expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

    // same party, ensure cannot decipher
    try {
      const uncipherContentSameParty = fioSDKBob.transactions.getUnCipherContent(
        ContentType.recordObtDataContent,
        cipherContent,
        alicePrivateKey,
        alicePublicKey,
      )
      expect(uncipherContentSameParty.payee_public_address).to.not.equal(bobPublicKey)
    } catch (e) {
      // successful, on failure.  Should not decrypt
    }

    // non party, ensure cannot decipher
    try {
      const uncipherContentNonParty = fioSDKBob.transactions.getUnCipherContent(
        ContentType.recordObtDataContent,
        cipherContent,
        nonPartyPrivateKey,
        bobPublicKey,
      )
      expect(uncipherContentNonParty.payee_public_address).to.not.equal(bobPublicKey)
    } catch (e) {
      // empty
    }

    try {
      const uncipherContentNonPartyA = fioSDKBob.transactions.getUnCipherContent(
        ContentType.recordObtDataContent,
        cipherContent,
        bobPrivateKey,
        nonPartyPublicKey,
      )
      expect(uncipherContentNonPartyA.payee_public_address).to.not.equal(bobPublicKey)
    } catch (e) {
      // empty
    }
  })
});
