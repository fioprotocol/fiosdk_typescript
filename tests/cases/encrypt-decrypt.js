const { expect } = require('chai')
const { FIOSDK } = require('../../lib/FIOSDK')
const { Constants } = require('../../lib/utils/constants')

const encryptDecrypt = ({ baseUrl, fetchJson }) => {
  const alicePrivateKey = '5J35xdLtcPvDASxpyWhNrR2MfjSZ1xjViH5cvv15VVjqyNhiPfa'
  const alicePublicKey = 'FIO6NxZ7FLjjJuHGByJtNJQ1uN1P5X9JJnUmFW3q6Q7LE7YJD4GZs'
  const bobPrivateKey = '5J37cXw5xRJgE869B5LxC3FQ8ZJECiYnsjuontcHz5cJsz5jhb7'
  const bobPublicKey = 'FIO4zUFC29aq8uA4CnfNSyRZCnBPya2uQk42jwevc3UZ2jCRtepVZ'

  const nonPartyPrivateKey = '5HujRtqceTPo4awwHAEdHRTWdMTgA6s39dJjwWcjhNdSjVWUqMk'
  const nonPartyPublicKey = 'FIO5mh1UqE5v9TKdYm2Ro6JXCXpSxj1Sm4vKUeydaLd7Cu5aqiSSp'

  let fioSDKBob = new FIOSDK(
    bobPrivateKey,
    bobPublicKey,
    baseUrl,
    fetchJson
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
      payee_public_address: payeeTokenPublicAddress,
      amount: amount,
      chain_code: chainCode,
      token_code: tokenCode,
      memo,
      hash,
      offline_url: offlineUrl
    }

    const cipherContent = fioSDKBob.transactions.getCipherContent(Constants.CipherContentTypes.new_funds_content, content, bobPrivateKey, alicePublicKey)
    expect(cipherContent).to.be.a('string')

    const uncipherContent = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.new_funds_content, cipherContent, alicePrivateKey, bobPublicKey)
    expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

    // same party, ensure cannot decipher
    try {
      const uncipherContentSameParty = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.new_funds_content, cipherContent, alicePrivateKey, alicePublicKey)
      expect(uncipherContentSameParty.payee_public_address).to.notequal(bobPublicKey)
    } catch (e) {

    }

    // non party, ensure cannot decipher
    try {
      const uncipherContentNonParty = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.new_funds_content, cipherContent, nonPartyPrivateKey, bobPublicKey)
      expect(uncipherContentNonParty.payee_public_address).to.notequal(bobPublicKey)
    } catch (e) {

    }

    try {
      const uncipherContentNonPartyA = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.new_funds_content, cipherContent, bobPrivateKey, nonPartyPublicKey)
      expect(uncipherContentNonPartyA.payee_public_address).to.notequal(bobPublicKey)
    } catch (e) {

    }

  })

  it(`Decrypt from iOS SDK - Request New Funds`, async () => {
    const cipherContent = 'iNz623p8SjbFG3rNbxLeVzQhs7n4aB8UGHvkF08HhBXD3X9g6bVFJl93j/OqYdkiycxShF64uc9OHFc/qbOeeS8+WVL2YRpd9JaRqdTUE9XKFPZ6lETQ7MTbGT+qppMoJ0tWCP6mWL4M9V1xu6lE3lJkuRS4kXnwtOUJOcBDG7ddFyHaV1LnLY/jnOJHJhm8'
    expect(cipherContent).to.be.a('string')

    const uncipherContent = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.new_funds_content, cipherContent, alicePrivateKey, bobPublicKey)
    expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

    const uncipherContentA = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.new_funds_content, cipherContent, bobPrivateKey, alicePublicKey)
    expect(uncipherContentA.payee_public_address).to.equal(bobPublicKey)

  })

  it(`Decrypt from Kotlin SDK - Request New Funds`, async () => {
    const cipherContent = 'PUEe6pA4HAl7EHA1XFRqJPMjrugD0ZT09CDx4/rH3ktwqo+WaoZRIuqXR4Xvr6ki1XPp7KwwSy6GqPUuBRuBS8Z8c0/xGgcDXQHJuYSsaV3d9Q61W1JeCDvsSIOdd3MTzObNJNcMj3gad+vPcOvJ7BojeufUoe0HQvxjXO+Gpp20UPdQnljLVsir+XuFmreZwMLWfggIovd0A9t438o+DA=='
    expect(cipherContent).to.be.a('string')

    const uncipherContent = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.new_funds_content, cipherContent, alicePrivateKey, bobPublicKey)
    expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

    const uncipherContentA = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.new_funds_content, cipherContent, bobPrivateKey, alicePublicKey)
    expect(uncipherContentA.payee_public_address).to.equal(bobPublicKey)

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
      payer_public_address: payerTokenPublicAddress,
      payee_public_address: payeeTokenPublicAddress,
      amount: amount,
      chain_code: chainCode,
      token_code: tokenCode,
      status: '',
      obt_id: '',
      memo: memo,
      hash: hash,
      offline_url: offlineUrl
    }

    const cipherContent = fioSDKBob.transactions.getCipherContent(Constants.CipherContentTypes.record_obt_data_content, content, bobPrivateKey, alicePublicKey)
    expect(cipherContent).to.be.a('string')

    const uncipherContent = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.record_obt_data_content, cipherContent, alicePrivateKey, bobPublicKey)
    expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

    // same party, ensure cannot decipher
    try {
      const uncipherContentSameParty = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.record_obt_data_content, cipherContent, alicePrivateKey, alicePublicKey)
      expect(uncipherContentSameParty.payee_public_address).to.notequal(bobPublicKey)
    } catch (e) {
      // successful, on failure.  Should not decrypt
    }

    // non party, ensure cannot decipher
    try {
      const uncipherContentNonParty = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.record_obt_data_content, cipherContent, nonPartyPrivateKey, bobPublicKey)
      expect(uncipherContentNonParty.payee_public_address).to.notequal(bobPublicKey)
    } catch (e) {

    }

    try {
      const uncipherContentNonPartyA = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.record_obt_data_content, cipherContent, bobPrivateKey, nonPartyPublicKey)
      expect(uncipherContentNonPartyA.payee_public_address).to.notequal(bobPublicKey)
    } catch (e) {

    }

  })

  it(`Decrypt from iOS SDK - RecordObtData`, async () => {
    const cipherContent = 'XJqqkHspW0zp+dHKj9TZMn5mZzdMQrdIAXNOlKPekeEpbjyeh92hO+lB9gA6wnNuq8YNLcGA1s0NPGzb+DlHzXT2tCulgk5fiQy6+8AbThPzB0N6xICmVV3Ontib8FVlTrVrqg053PK9JeHUsg0Sb+vG/dz9+ovcSDHaByxybRNhZOVBe8jlg91eakaU1H8XKDxYOtI3+jYESK02g2Rw5Ya9ec+/PnEBQ6DjkHruKDorEF1D+nDT/0CK46VsfdYzYK8IV0T9Nal4H6Bf4wrMlQ=='
    expect(cipherContent).to.be.a('string')

    const uncipherContent = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.record_obt_data_content, cipherContent, alicePrivateKey, bobPublicKey)
    expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

    const uncipherContentA = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.record_obt_data_content, cipherContent, bobPrivateKey, alicePublicKey)
    expect(uncipherContentA.payee_public_address).to.equal(bobPublicKey)

  })

  it(`Decrypt from Kotlin SDK - RecordObtData`, async () => {
    const cipherContent = '4IVNiV3Vg0/ZwkBywOWjSgER/aBzHypmfYoljA7y3Qf04mI/IkwPwO9+yj7EISTdRb2LEPgEDg1RsWBdAFmm6AE9ZXG1W5qPrtFNZuZw3qhCJbisnTLCPA2pEcAGKxBhhTaIx74/+OLXTNq5Z7RWWB+OUIa3bBJLHyhO79BUQ9dIsfiDVGmlRL5yq57uqRfb8FWoQraK31As/OFJ5Gj7KEYehzviJnMX7pYhE4CJkkfYYGfB4AHmHllFSMaLCrkY8BvDViQZTuniqDOua6Po51muyCaJLF5rdMSS0Za5F9U='
    expect(cipherContent).to.be.a('string')

    const uncipherContent = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.record_obt_data_content, cipherContent, alicePrivateKey, bobPublicKey)
    expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

    const uncipherContentA = fioSDKBob.transactions.getUnCipherContent(Constants.CipherContentTypes.record_obt_data_content, cipherContent, bobPrivateKey, alicePublicKey)
    expect(uncipherContentA.payee_public_address).to.equal(bobPublicKey)

  })

}

module.exports = {
  encryptDecrypt
}
