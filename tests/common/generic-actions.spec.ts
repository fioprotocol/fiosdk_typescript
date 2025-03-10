import { expect } from 'chai';
import 'mocha';
import { Account, Action, EndPoint, FIOSDK, RenewFioAddressResponse } from '../../src/FIOSDK';
import { generateTestingFioDomain, generateTestingFioAddress, ErrorType, timeout } from '../utils';
import { defaultBundledSets, ethChainCode, ethTokenCode, fioChainCode, fioTokenCode, defaultFee } from '../constants';

export const GenericActionsTests = ({
  fioSdk,
  fioSdk2,
  publicKey,
  publicKey2,
  testFioAddressName,
  testFioDomainName,
}: {
  fioSdk: FIOSDK,
  fioSdk2: FIOSDK,
  publicKey: string,
  publicKey2: string,
  testFioAddressName: string,
  testFioDomainName: string,
}) => describe('Testing generic actions', () => {
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
    const sufa = FIOSDK.amountToSUF(100)
    expect(sufa).to.equal(100000000000)

    const sufb = FIOSDK.amountToSUF(500)
    expect(sufb).to.equal(500000000000)

    const sufc = FIOSDK.amountToSUF(506)
    expect(sufc).to.equal(506000000000)

    const sufd = FIOSDK.amountToSUF(1)
    expect(sufd).to.equal(1000000000)

    const sufe = FIOSDK.amountToSUF(2)
    expect(sufe).to.equal(2000000000)

    const suff = FIOSDK.amountToSUF(2.568)
    expect(suff).to.equal(2568000000)

    const sufg = FIOSDK.amountToSUF(2.123)
    expect(sufg).to.equal(2123000000)

    const sufh = FIOSDK.amountToSUF(10.0102)
    expect(sufh).to.equal(10010200000)
  })

  it(`FIO SUF Utilities - SUFToAmount`, async () => {
    const sufa = FIOSDK.SUFToAmount(100000000000)
    expect(sufa).to.equal(100)

    const sufb = FIOSDK.SUFToAmount(500000000000)
    expect(sufb).to.equal(500)

    const sufc = FIOSDK.SUFToAmount(506000000000)
    expect(sufc).to.equal(506)

    const sufd = FIOSDK.SUFToAmount(1000000000)
    expect(sufd).to.equal(1)

    const sufe = FIOSDK.SUFToAmount(2000000000)
    expect(sufe).to.equal(2)

    const suff = FIOSDK.SUFToAmount(2568000000)
    expect(suff).to.equal(2.568)

    const sufg = FIOSDK.SUFToAmount(2123000000)
    expect(sufg).to.equal(2.123)

    const sufh = FIOSDK.SUFToAmount(10010200000)
    expect(sufh).to.equal(10.0102)
  })

  it(`FIO SUF Utilities - amountToSUFString`, async () => {
    const sufa = FIOSDK.amountToSUFString(100)
    expect(sufa).to.equal('100000000000')

    const sufb = FIOSDK.amountToSUFString(500)
    expect(sufb).to.equal('500000000000')

    const sufc = FIOSDK.amountToSUFString(506)
    expect(sufc).to.equal('506000000000')

    const sufd = FIOSDK.amountToSUFString(1)
    expect(sufd).to.equal('1000000000')

    const sufe = FIOSDK.amountToSUFString(2)
    expect(sufe).to.equal('2000000000')

    const suff = FIOSDK.amountToSUFString(2.568)
    expect(suff).to.equal('2568000000')

    const sufg = FIOSDK.amountToSUFString(2.123)
    expect(sufg).to.equal('2123000000')

    const sufh = FIOSDK.amountToSUFString(10.0102)
    expect(sufh).to.equal('10010200000')
  })

  it(`FIO SUF Utilities - SUFToAmountString`, async () => {
    const sufa = FIOSDK.SUFToAmountString(100000000000)
    expect(sufa).to.equal('100')

    const sufb = FIOSDK.SUFToAmountString(500000000000)
    expect(sufb).to.equal('500')

    const sufc = FIOSDK.SUFToAmountString('506000000000')
    expect(sufc).to.equal('506')

    const sufd = FIOSDK.SUFToAmountString(1000000000)
    expect(sufd).to.equal('1')

    const sufe = FIOSDK.SUFToAmountString(2000000000)
    expect(sufe).to.equal('2')

    const suff = FIOSDK.SUFToAmountString(2568000000)
    expect(suff).to.equal('2.568')

    const sufg = FIOSDK.SUFToAmountString(2123000000)
    expect(sufg).to.equal('2.123')

    const sufh = FIOSDK.SUFToAmountString(10010200000)
    expect(sufh).to.equal('10.0102')
  })

  it(`Validation methods`, async () => {
    try {
      FIOSDK.isChainCodeValid('$%34')
    } catch (e) {
      const error = e as ErrorType;
      expect(error.list[0].message).to.equal('chainCode must match /^[a-z0-9]+$/i.')
    }
    try {
      FIOSDK.isTokenCodeValid('')
    } catch (e) {
      const error = e as ErrorType;

      expect(error.list[0].message).to.equal('tokenCode must have a length between 1 and 10.')
    }
    try {
      FIOSDK.isFioAddressValid('f')
    } catch (e) {
      const error = e as ErrorType;

      expect(error.list[0].message).to.equal('fioAddress must have a length between 3 and 64.')
    }
    try {
      FIOSDK.isFioDomainValid('$%FG%')
    } catch (e) {
      const error = e as ErrorType;

      expect(error.list[0].message).to.equal('fioDomain must match /^[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?$/i.')
    }
    try {
      FIOSDK.isFioPublicKeyValid('dfsd')
    } catch (e) {
      const error = e as ErrorType;

      expect(error.list[0].message).to.equal('Validation failed for fioPublicKey.')
    }
    try {
      FIOSDK.isFioPublicKeyValid('FIO62pyd3nDt8d53ZJ1dyG')
    } catch (e) {
      const error = e as ErrorType;

      expect(error.list[0].message).to.equal('Validation failed for fioPublicKey.')
    }
    
    try {
      FIOSDK.isPublicAddressValid('')
    } catch (e) {
      const error = e as ErrorType;

      expect(error.list[0].message).to.equal('publicAddress must have a length between 1 and 128.')
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

    const privateKeyIsValid = FIOSDK.isFioPublicKeyValid(publicKey)
    expect(privateKeyIsValid).to.equal(true)

    const publicKeyIsValid = FIOSDK.isPublicAddressValid(publicKey)
    expect(publicKeyIsValid).to.equal(true)
  })

  it(`Getting fio public key`, async () => {
    const result = await fioSdk.genericAction('getFioPublicKey')

    expect(result).to.equal(publicKey)
  })

  it(`getFioBalance`, async () => {
    const result = await fioSdk.genericAction('getFioBalance', {})

    expect(result).to.have.all.keys('balance', 'available', 'staked', 'srps', 'roe')
    expect(result.balance).to.be.a('number')
    expect(result.available).to.be.a('number')
    expect(result.staked).to.be.a('number')
    expect(result.srps).to.be.a('number')
    expect(result.roe).to.be.a('string')
  })

  it(`Register fio domain`, async () => {
    const result = await fioSdk.genericAction('registerFioDomain', { fioDomain: newFioDomain, maxFee: defaultFee })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`Register fio domain address`, async () => {
    const newFioDomainCombo = generateTestingFioDomain();
    const fioAddressCombo = generateTestingFioAddress(newFioDomainCombo);
    const result = await fioSdk.genericAction('registerFioDomainAddress', {
      fioAddress: fioAddressCombo,
      maxFee: defaultFee,
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`Renew fio domain`, async () => {
    const result = await fioSdk.genericAction('renewFioDomain', { fioDomain: newFioDomain, maxFee: defaultFee })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`setFioDomainVisibility true`, async () => {
    const result = await fioSdk.genericAction('setFioDomainVisibility', {
      fioDomain: newFioDomain,
      isPublic: true,
      maxFee: defaultFee,
      technologyProviderId: '',
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`Register fio address`, async () => {
    const result = await fioSdk.genericAction('registerFioAddress', {
      fioAddress: newFioAddress,
      maxFee: defaultFee,
    })
    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`Register owner fio address`, async () => {
    const newFioAddress2 = generateTestingFioAddress(newFioDomain)
    const result = await fioSdk.genericAction('registerFioAddress', {
      fioAddress: newFioAddress2,
      maxFee: defaultFee,
      ownerPublicKey: publicKey2,
    })
    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`Renew fio address`, async () => {
    const result = await fioSdk.genericAction('renewFioAddress', { fioAddress: newFioAddress, maxFee: defaultFee })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`Push Transaction - renewaddress`, async () => {
    await timeout(2000)
    const result = await fioSdk.genericAction('pushTransaction', {
      account: Account.address,
      action: Action.renewAddress,
      data: {
        fio_address: newFioAddress,
        max_fee: defaultFee,
        tpid: '',
      },
    }) as RenewFioAddressResponse
    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'expiration', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.expiration).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getFioNames`, async () => {
    const result = await fioSdk.genericAction('getFioNames', { fioPublicKey: publicKey })

    expect(result).to.have.all.keys('fio_domains', 'fio_addresses')
    expect(result.fio_domains).to.be.a('array')
    expect(result.fio_addresses).to.be.a('array')
  })

  it(`getFioDomains`, async () => {
    try {
      const result = await fioSdk.genericAction('getFioDomains', { fioPublicKey: fioSdk.publicKey })

      expect(result).to.have.all.keys('fio_domains', 'more')
      expect(result.fio_domains).to.be.a('array')
    } catch (e) {
      console.log(e)
    }
  })

  it(`setFioDomainVisibility false`, async () => {
    const result = await fioSdk.genericAction('setFioDomainVisibility', {
      fioDomain: newFioDomain,
      isPublic: false,
      maxFee: defaultFee,
      technologyProviderId: '',
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`setFioDomainVisibility true`, async () => {
    const result = await fioSdk.genericAction('setFioDomainVisibility', {
      fioDomain: newFioDomain,
      isPublic: true,
      maxFee: defaultFee,
      technologyProviderId: '',
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getFee for transferFioDomain`, async () => {
    const result = await fioSdk.genericAction('getFeeForTransferFioDomain', {
      fioAddress: newFioAddress,
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`Transfer fio domain`, async () => {
    const result = await fioSdk.genericAction('transferFioDomain', {
      fioDomain: newFioDomain,
      maxFee: defaultFee,
      newOwnerKey: pubKeyForTransfer,
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getFee for addBundledTransactions`, async () => {
    const result = await fioSdk.genericAction('getFeeForAddBundledTransactions', {
      fioAddress: newFioAddress,
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`add Bundled Transactions`, async () => {
    const result = await fioSdk.genericAction('addBundledTransactions', {
      bundleSets: defaultBundledSets,
      fioAddress: newFioAddress,
      maxFee: defaultFee,
    })
    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getFee for addPublicAddress`, async () => {
    const result = await fioSdk.genericAction('getFeeForAddPublicAddress', {
      fioAddress: newFioAddress,
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`Add public address`, async () => {
    const result = await fioSdk.genericAction('addPublicAddress', {
      chainCode: fioChainCode,
      fioAddress: newFioAddress,
      maxFee: defaultFee,
      publicAddress: '1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs',
      technologyProviderId: '',
      tokenCode: fioTokenCode,
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`Add public addresses`, async () => {
    const result = await fioSdk.genericAction('addPublicAddresses', {
      fioAddress: newFioAddress,
      maxFee: defaultFee,
      publicAddresses: [
        {
          chain_code: ethChainCode,
          public_address: 'xxxxxxyyyyyyzzzzzz',
          token_code: ethTokenCode,
        },
        {
          chain_code: fioChainCode,
          public_address: publicKey,
          token_code: fioTokenCode,
        },
      ],
      technologyProviderId: '',
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getPublicAddress`, async () => {
    const result = await fioSdk.genericAction('getPublicAddress', {
      chainCode: fioChainCode, fioAddress: newFioAddress, tokenCode: fioTokenCode,
    })

    expect(result.public_address).to.be.a('string')
  })

  it(`getPublicAddresses`, async () => {
    const result = await fioSdk.genericAction('getPublicAddresses', {
      fioAddress: newFioAddress, limit: 10, offset: 0,
    })

    expect(result).to.have.all.keys('public_addresses', 'more')
    expect(result.public_addresses).to.be.a('array')
    expect(result.more).to.be.a('boolean')
  })

  it(`getFee for removePublicAddresses`, async () => {
    const result = await fioSdk.genericAction('getFeeForRemovePublicAddresses', {
      fioAddress: newFioAddress,
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`Remove public addresses`, async () => {
    const result = await fioSdk.genericAction('removePublicAddresses', {
      fioAddress: newFioAddress,
      maxFee: defaultFee,
      publicAddresses: [
        {
          chain_code: ethChainCode,
          public_address: 'xxxxxxyyyyyyzzzzzz',
          token_code: ethTokenCode,
        },
      ],
      technologyProviderId: '',
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getFee for removeAllPublicAddresses`, async () => {

    const result = await fioSdk.genericAction('getFeeForRemoveAllPublicAddresses', {
      fioAddress: newFioAddress,
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`Remove all public addresses`, async () => {
    await fioSdk.genericAction('addPublicAddresses', {
      fioAddress: newFioAddress,
      maxFee: defaultFee,
      publicAddresses: [
        {
          chain_code: ethChainCode,
          public_address: 'xxxxxxyyyyyyzzzzzz1',
          token_code: ethTokenCode,
        },
      ],
      technologyProviderId: '',
    })

    const result = await fioSdk.genericAction('removeAllPublicAddresses', {
      fioAddress: newFioAddress,
      maxFee: defaultFee,
      technologyProviderId: '',
    })
    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`isAvailable true`, async () => {
    const result = await fioSdk.genericAction('isAvailable', {
      fioName: generateTestingFioAddress(testFioDomainName),
    })

    expect(result.is_registered).to.equal(0)
  })

  it(`isAvailable false`, async () => {
    const result = await fioSdk.genericAction('isAvailable', {
      fioName: testFioAddressName,
    })

    expect(result.is_registered).to.equal(1)
  })

  it(`getFioBalance for custom fioPublicKey`, async () => {
    const result = await fioSdk.genericAction('getFioBalance', {
      fioPublicKey: publicKey2,
    })

    expect(result).to.have.all.keys('balance', 'available', 'staked', 'srps', 'roe')
    expect(result.balance).to.be.a('number')
    expect(result.available).to.be.a('number')
    expect(result.staked).to.be.a('number')
    expect(result.srps).to.be.a('number')
    expect(result.roe).to.be.a('string')
  })

  it(`getFioAddresses`, async () => {
    const result = await fioSdk.genericAction('getFioAddresses', { fioPublicKey: publicKey })

    expect(result).to.have.all.keys('fio_addresses', 'more')
    expect(result.fio_addresses).to.be.a('array')
  })

  it(`getFee`, async () => {
    const result = await fioSdk.genericAction('getFee', {
      endPoint: EndPoint.registerFioAddress,
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`getMultiplier`, async () => {
    const result = await fioSdk.genericAction('getMultiplier')

    expect(result).to.be.a('number')
  })

  it(`getFee for transferFioAddress`, async () => {
    const result = await fioSdk.genericAction('getFeeForTransferFioAddress', {
      fioAddress: newFioAddress,
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`Transfer fio address`, async () => {
    const result = await fioSdk.genericAction('transferFioAddress', {
      fioAddress: newFioAddress,
      maxFee: defaultFee,
      newOwnerKey: publicKey2,
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getFee for BurnFioAddress`, async () => {
    const result = await fioSdk.genericAction('getFeeForBurnFioAddress', {
      fioAddress: newFioAddress,
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`Burn fio address`, async () => {
    try {
      const result = await fioSdk2.genericAction('burnFioAddress', {
        fioAddress: newFioAddress,
        maxFee: defaultFee,
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

  it(`Get Account Public Key`, async () => {
    const accountName = FIOSDK.accountHash(publicKey).accountnm;
    const result = await fioSdk.genericAction('getAccountPubKey', {
      account: accountName
    });

    expect(result.fio_public_key).to.equal(publicKey)
  })

  it(`Get Ecrypted Key`, async () => {
    const result = await fioSdk.genericAction('getEncryptKey', {
      fioAddress: testFioAddressName,
    });

    expect(result.encrypt_public_key).to.equal(publicKey);
  });
})
