const { expect } = require('chai')
const { FIOSDK } = require('../../lib/FIOSDK')
const { Constants } = require('../../lib/utils/constants')
const { EndPoint } = require('../../lib/entities/EndPoint')

const actionNames = Constants.actionNames
const generalTests = ({
  testFioAddressName,
  testFioAddressName2,
  ethChainCode,
  ethTokenCode,
  fioChainCode,
  fioTokenCode,
  defaultFee,
  generateTestingFioDomain,
  generateTestingFioAddress
}) => {

  const newFioDomain = generateTestingFioDomain()
  const newFioAddress = generateTestingFioAddress(newFioDomain)
  const privateKeyExample = '5Kbb37EAqQgZ9vWUHoPiC2uXYhyGSFNbL6oiDp24Ea1ADxV1qnu'
  const publicKeyExample = 'FIO5kJKNHwctcfUM5XZyiWSqSTM5HTzznJP9F3ZdbhaQAHEVq575o'
  const pubKeyForTransfer = 'FIO7isxEua78KPVbGzKemH4nj2bWE52gqj8Hkac3tc7jKNvpfWzYS'

  it(`FIO Key Generation Testing`, async () => {
    const testMnemonic = 'valley alien library bread worry brother bundle hammer loyal barely dune brave'
    const privateKeyRes = await FIOSDK.createPrivateKeyMnemonic(testMnemonic)
    expect(privateKeyRes.fioKey).to.equal(privateKeyExample)
    const publicKeyRes = FIOSDK.derivedPublicKey(privateKeyRes.fioKey)
    expect(publicKeyRes.publicKey).to.equal(publicKeyExample)
  })

  it(`FIO SUF Utilities - amountToSUF`, async () => {
    const sufa = FIOSDK.amountToSUF (100)
    expect(sufa).to.equal(100000000000)

    const sufb = FIOSDK.amountToSUF (500)
    expect(sufb).to.equal(500000000000)

    const sufc = FIOSDK.amountToSUF (506)
    expect(sufc).to.equal(506000000000)

    const sufd = FIOSDK.amountToSUF (1)
    expect(sufd).to.equal(1000000000)

    const sufe = FIOSDK.amountToSUF (2)
    expect(sufe).to.equal(2000000000)

    const suff = FIOSDK.amountToSUF (2.568)
    expect(suff).to.equal(2568000000)

    const sufg = FIOSDK.amountToSUF (2.123)
    expect(sufg).to.equal(2123000000)
  })

  it(`FIO SUF Utilities - SUFToAmount`, async () => {
    const sufa = FIOSDK.SUFToAmount (100000000000)
    expect(sufa).to.equal(100)

    const sufb = FIOSDK.SUFToAmount (500000000000)
    expect(sufb).to.equal(500)

    const sufc = FIOSDK.SUFToAmount (506000000000)
    expect(sufc).to.equal(506)

    const sufd = FIOSDK.SUFToAmount (1000000000)
    expect(sufd).to.equal(1)

    const sufe = FIOSDK.SUFToAmount (2000000000)
    expect(sufe).to.equal(2)

    const suff = FIOSDK.SUFToAmount (2568000000)
    expect(suff).to.equal(2.568)

    const sufg = FIOSDK.SUFToAmount (2123000000)
    expect(sufg).to.equal(2.123)
  })

  it(`Validation methods`, async () => {
    try {
      FIOSDK.isChainCodeValid('$%34')
    } catch (e) {
      expect(e.list[0].message).to.equal('chainCode must match /^[a-z0-9]+$/i.')
    }
    try {
      FIOSDK.isTokenCodeValid('')
    } catch (e) {
      expect(e.list[0].message).to.equal('tokenCode is required.')
    }
    try {
      FIOSDK.isFioAddressValid('f')
    } catch (e) {
      expect(e.list[0].message).to.equal('fioAddress must have a length between 3 and 64.')
    }
    try {
      FIOSDK.isFioDomainValid('$%FG%')
    } catch (e) {
      expect(e.list[0].message).to.equal('fioDomain must match /^[a-z0-9\\-]+$/i.')
    }
    try {
      FIOSDK.isFioPublicKeyValid('dfsd')
    } catch (e) {
      expect(e.list[0].message).to.equal('fioPublicKey must match /^FIO\\w+$/.')
    }
    try {
      FIOSDK.isPublicAddressValid('')
    } catch (e) {
      expect(e.list[0].message).to.equal('publicAddress is required.')
    }

    const chainCodeIsValid = FIOSDK.isChainCodeValid('FIO')
    expect(chainCodeIsValid).to.equal(true)

    const tokenCodeIsValid = FIOSDK.isTokenCodeValid('FIO')
    expect(tokenCodeIsValid).to.equal(true)

    const singleDigitFioAddressIsValid = FIOSDK.isFioAddressValid('f@2')
    expect(singleDigitFioAddressIsValid).to.equal(true)

    const fioAddressIsValid = FIOSDK.isFioAddressValid(newFioAddress)
    expect(fioAddressIsValid).to.equal(true)

    const fioDomainIsValid = FIOSDK.isFioDomainValid(newFioDomain)
    expect(fioDomainIsValid).to.equal(true)

    const privateKeyIsValid = FIOSDK.isFioPublicKeyValid(fioSdk.publicKey)
    expect(privateKeyIsValid).to.equal(true)

    const publicKeyIsValid = FIOSDK.isPublicAddressValid(fioSdk.publicKey)
    expect(publicKeyIsValid).to.equal(true)
  })

  it(`Getting fio public key`, async () => {
    const result = await fioSdk.getFioPublicKey()

    expect(result).to.equal(fioSdk.publicKey)
  })

  it(`getFioBalance`, async () => {
    const result = await fioSdk.getFioBalance()

    expect(result).to.have.all.keys('balance')
    expect(result.balance).to.be.a('number')
  })

  it(`Register fio domain`, async () => {
    const result = await fioSdk.pushTransaction(actionNames.regdomain, {
      fio_domain: newFioDomain,
      owner_fio_public_key: fioSdk.publicKey,
      max_fee: defaultFee
    })

    expect(result).to.have.all.keys('status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`Renew fio domain`, async () => {
    const result = await fioSdk.pushTransaction(actionNames.renewdomain, {
      fio_domain: newFioDomain,
      max_fee: defaultFee,
    })

    expect(result).to.have.all.keys('status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`setFioDomainVisibility true`, async () => {
    const result = await fioSdk.pushTransaction(actionNames.setdomainpub, {
      fio_domain: newFioDomain,
      is_public: 1,
      max_fee: defaultFee,
      tpid: ''
    })

    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`Register fio address`, async () => {
    const result = await fioSdk.pushTransaction(
      actionNames.regaddress,
      {
        fio_address: newFioAddress,
        owner_fio_public_key: fioSdk.publicKey,
        max_fee: defaultFee
      }
    )

    expect(result).to.have.all.keys('status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`getFioNames`, async () => {
    const result = await fioSdk.getFioNames(fioSdk.publicKey)

    expect(result).to.have.all.keys('fio_domains', 'fio_addresses')
    expect(result.fio_domains).to.be.a('array')
    expect(result.fio_addresses).to.be.a('array')
  })

  it(`getFioDomains`, async () => {
    try{
      const result = await fioSdk.get(EndPoint.getDomains, { fio_public_key: fioSdk.publicKey })

      expect(result).to.have.all.keys('fio_domains','more')
      expect(result.fio_domains).to.be.a('array')
    } catch (e) {
      console.log(e);
    }
  })

  it(`Register owner fio address`, async () => {
    const newFioAddress2 = generateTestingFioAddress(newFioDomain)

    const result = await fioSdk.pushTransaction(
      actionNames.regaddress,
      {
        fio_address: newFioAddress2,
        owner_fio_public_key: fioSdk2.publicKey,
        max_fee: defaultFee
      }
    )
    expect(result).to.have.all.keys('status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`setFioDomainVisibility false`, async () => {
    const result = await fioSdk.pushTransaction(actionNames.setdomainpub, {
      fio_domain: newFioDomain,
      is_public: 0,
      max_fee: defaultFee,
      tpid: ''
    })

    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`setFioDomainVisibility true`, async () => {
    const result = await fioSdk.pushTransaction(actionNames.setdomainpub, {
      fio_domain: newFioDomain,
      is_public: 1,
      max_fee: defaultFee,
      tpid: ''
    })

    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`getFee for transferFioDomain`, async () => {
    const result = await fioSdk.getFee(EndPoint.transferFioDomain, newFioAddress)

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`Transfer fio domain`, async () => {
    const result = await fioSdk.pushTransaction(actionNames.xferdomain, {
      fio_domain: newFioDomain,
      new_owner_fio_public_key: pubKeyForTransfer,
      max_fee: defaultFee,
    })

    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`Renew fio address`, async () => {
    const result = await fioSdk.pushTransaction(actionNames.renewaddress, {
      fio_address: newFioAddress,
      max_fee: defaultFee,
    })

    expect(result).to.have.all.keys('status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`getFee for addPublicAddress`, async () => {
    const result = await fioSdk.getFee(EndPoint.addPubAddress, newFioAddress)

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`Add public address`, async () => {
    const result = await fioSdk.pushTransaction(actionNames.addaddress, {
      fio_address: newFioAddress,
      public_addresses: [
        {
          chain_code: fioChainCode,
          token_code: fioTokenCode,
          public_address: '1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs'
        }
      ],
      max_fee: defaultFee,
    })

    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`Add public addresses`, async () => {
    const result = await fioSdk.pushTransaction(actionNames.addaddress, {
      fio_address: newFioAddress,
      public_addresses: [
        {
          chain_code: ethChainCode,
          token_code: ethTokenCode,
          public_address: 'xxxxxxyyyyyyzzzzzz',
        },
        {
          chain_code: fioChainCode,
          token_code: fioTokenCode,
          public_address: fioSdk.publicKey,
        }
      ],
      max_fee: defaultFee
    })

    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`Remove public addresses`, async () => {
    const result = await fioSdk.pushTransaction(actionNames.remaddress, {
      fio_address: newFioAddress,
      public_addresses: [
        {
          chain_code: ethChainCode,
          token_code: ethTokenCode,
          public_address: 'xxxxxxyyyyyyzzzzzz',
        }
      ],
      max_fee: defaultFee
    })
    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`Remove all public addresses`, async () => {
    await fioSdk.pushTransaction(actionNames.addaddress, {
      fio_address: newFioAddress,
      public_addresses: [
        {
          chain_code: ethChainCode,
          token_code: ethTokenCode,
          public_address: 'xxxxxxyyyyyyzzzzzz1',
        }
      ],
      max_fee: defaultFee
    })

    const result = await fioSdk.pushTransaction(actionNames.remalladdr, {
      fio_address: newFioAddress,
      max_fee: defaultFee
    })
    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`isAvailable true`, async () => {
    const result = await fioSdk.isAvailable(generateTestingFioAddress())

    expect(result.is_registered).to.equal(0)
  })

  it(`isAvailable false`, async () => {
    const result = await fioSdk.isAvailable(testFioAddressName)

    expect(result.is_registered).to.equal(1)
  })

  it(`getFioBalance for custom fioPublicKey`, async () => {
    const result = await fioSdk.getFioBalance(fioSdk2.publicKey)

    expect(result).to.have.all.keys('balance')
    expect(result.balance).to.be.a('number')
  })

  it(`getFioAddresses`, async () => {
    try {
      const result = await fioSdk.get(EndPoint.getAddresses, { fio_public_key: fioSdk.publicKey })

      expect(result).to.have.all.keys('fio_addresses','more')
      expect(result.fio_addresses).to.be.a('array')
    } catch (e) {
      console.log(e);
    }
  })

  it(`getPublicAddress`, async () => {
    const result = await fioSdk.getPublicAddress(newFioAddress, fioChainCode, fioTokenCode)

    expect(result.public_address).to.be.a('string')
  })

  it(`getFee`, async () => {
    const result = await fioSdk.getFee(EndPoint.registerFioAddress)

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`getMultiplier`, async () => {
    const result = await fioSdk.getMultiplier()

    expect(result).to.be.a('number')
  })

}

module.exports = {
  generalTests
}
