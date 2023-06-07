require('mocha')
const { expect } = require('chai')
const { FIOSDK } = require('../lib/FIOSDK')
const { EndPoint } = require('../lib/entities/EndPoint')

fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

/**
 * Please set your private/public keys and existing fioAddresses
 */
let privateKey = '',
  publicKey = '',
  privateKey2 = '',
  publicKey2 = '',
  testFioAddressName = '',
  testFioAddressName2 = '',
  testFioDomainName = '';

/**
 * Public Testnet API nodes can be found at: https://github.com/fioprotocol/fio.mainnet
 */

const baseUrls = ['https://testnet.fioprotocol.io:443/v1/']

const fioTestnetDomain = 'fiotestnet'
const fioTokenCode = 'FIO'
const fioChainCode = 'FIO'
const ethTokenCode = 'ETH'
const ethChainCode = 'ETH'
const defaultBundledSets = 1
const defaultFee = 800 * FIOSDK.SUFUnit
const stakingTPID = ''   // e.g., 'autoproxy@fiotestnet'
const wrongBaseUrl = 'https://wrong-url-test.test.com/'
const wrongBaseUrl2 = 'https://wrong-url-test-2.com/'

let fioSdk,
  fioSdk2,
  fioSdkWithWrongBaseUrl

const generateTestingFioAddress = (customDomain = fioTestnetDomain) => {
  return `testing${Date.now()}@${customDomain}`
}

const generateTestingFioDomain = () => {
  return `testing-domain-${Date.now()}`
}

const generateObtId = () => {
  return `${Date.now()}`
}

const generateHashForNft = () => {
  const now = `${Date.now()}`
  return `f83b5702557b1ee76d966c6bf92ae0d038cd176aaf36f86a18e${now.slice(0, 13)}`
}

const timeout = async (ms) => {
  await new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

before(async () => {
  fioSdk = new FIOSDK(
    privateKey,
    publicKey,
    baseUrls,
    fetchJson
  )

  await timeout(1000)
  fioSdk2 = new FIOSDK(
    privateKey2,
    publicKey2,
    baseUrls,
    fetchJson
  )

  fioSdkWithWrongBaseUrl = new FIOSDK(
    privateKey2,
    publicKey2,
    baseUrls,
    fetchJson
  )

  try {
    const isAvailableResult = await fioSdk.genericAction('isAvailable', {
      fioName: testFioAddressName
    })
    if (!isAvailableResult.is_registered) {
      await fioSdk.genericAction('registerFioAddress', {
        fioAddress: testFioAddressName,
        maxFee: defaultFee
      })
    }
  } catch (e) {
    console.log(e);
  }
  try {
    const isAvailableResult2 = await fioSdk2.genericAction('isAvailable', {
      fioName: testFioAddressName2
    })
    if (!isAvailableResult2.is_registered) {
      await fioSdk2.genericAction('registerFioAddress', {
        fioAddress: testFioAddressName2,
        maxFee: defaultFee
      })
    }
  } catch (e) {
    console.log(e);
  }

  await timeout(4000)
})

describe('Raw Abi missing', () => {
  let consoleWarnOriginal; // Store the original console.warn method
  let consoleWarnMessages = [];

  beforeEach(() => {
    consoleWarnOriginal = console.warn; // Store the original console.warn method
    console.warn = (...args) => {
      consoleWarnMessages.push(args.join(' '));
    };
  });

  afterEach(() => {
    console.warn = consoleWarnOriginal; // Restore the original console.warn method
    consoleWarnMessages = []; // Reset the captured warning messages
  });

  it(`Get FIO Balance to test Raw Abi`, async () => {
    FIOSDK.setCustomRawAbiAccountName('fio.absentabi');

    const result = await fioSdk.genericAction('getFioBalance', {})

    const fioSdkAbiWarning = consoleWarnMessages.find((message) =>
      message.includes('FIO_SDK ABI WARNING:')
    );

    FIOSDK.setCustomRawAbiAccountName(null);
    
    expect(fioSdkAbiWarning).to.exist;

    expect(result).to.have.all.keys('balance', 'available', 'staked', 'srps', 'roe')
    expect(result.balance).to.be.a('number')
    expect(result.available).to.be.a('number')
    expect(result.staked).to.be.a('number')
    expect(result.srps).to.be.a('number')
    expect(result.roe).to.be.a('string')
  })
})

describe('Testing request timeout on wrong url', () => {
  it(`Get Fio Ballance with wrong base url`, async () => {
    try {
      fioSdkWithWrongBaseUrl.setApiUrls([wrongBaseUrl]);
      await fioSdkWithWrongBaseUrl.genericAction('getFioBalance', {});
    } catch (e) {
      expect(e.message).to.match(/request_timeout|ENOTFOUND/);
    }
  });

  it(`Get Fio Ballance with 2 wrong base urls`, async () => {
    try {
      fioSdkWithWrongBaseUrl.setApiUrls([wrongBaseUrl, wrongBaseUrl2]);
      await fioSdkWithWrongBaseUrl.genericAction('getFioBalance', {});
    } catch (e) {
      expect(e.message).to.match(/request_timeout|ENOTFOUND/);
    }
  });

  /* todo: uncomment when DASH-678 missing raw abi task will be merged
  it(`Get Fio Ballance with one wrong and correct base urls`, async () => {
    fioSdkWithWrongBaseUrl.setApiUrls([wrongBaseUrl, ...baseUrls]);

    const result = await fioSdkWithWrongBaseUrl.genericAction(
      'getFioBalance',
      {}
    );
      expect(result).to.have.all.keys(
        'balance',
        'available',
        'staked',
        'srps',
        'roe'
      );
      expect(result.balance).to.be.a('number');
      expect(result.available).to.be.a('number');
      expect(result.staked).to.be.a('number');
      expect(result.srps).to.be.a('number');
      expect(result.roe).to.be.a('string');
  });
  */

  it(`Make removePublicAddresses request with wrong parameter and correct base url`, async () => {
    fioSdkWithWrongBaseUrl.setApiUrls([baseUrls]);
    try {
      await fioSdk.genericAction('removePublicAddresses', {
        fioAddress: '',
        publicAddresses: [
          {
            chain_code: 'BCH',
            token_code: 'BCH',
            public_address:
              'bitcoincash:qzf8zha74ahdh9j0xnwlffdn0zuyaslx3c90q7n9g9',
          },
          {
            chain_code: 'DASH',
            token_code: 'DASH',
            public_address: 'XyCyPKzTWvW2XdcYjPaPXGQDCGk946ywEv',
          },
        ],
        maxFee: 600000000,
        tpid: '',
      });
    } catch (err) {
      expect(err.message).to.equal('Validation error');
      expect(err.list[0].message).to.equal('fioAddress is required.');
    }
  });

  it(`Return back correct baseUrls`, () => {
    fioSdkWithWrongBaseUrl.setApiUrls([baseUrls]);
  });
})

describe('Testing generic actions', () => {

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
      expect(e.list[0].message).to.equal('fioDomain must match /^[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}$/i.')
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

    const privateKeyIsValid = FIOSDK.isFioPublicKeyValid(publicKey)
    expect(privateKeyIsValid).to.equal(true)

    const publicKeyIsValid = FIOSDK.isPublicAddressValid(publicKey)
    expect(publicKeyIsValid).to.equal(true)
  })

  it(`Getting fio public key`, async () => {
    const result = await fioSdk.genericAction('getFioPublicKey', {})

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
      technologyProviderId: ''
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
      maxFee: defaultFee
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
      ownerPublicKey: publicKey2,
      maxFee: defaultFee
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
      action: 'renewaddress',
      account: 'fio.address',
      data: {
        fio_address: newFioAddress,
        max_fee: defaultFee,
        tpid: ''
      }
    })
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
      console.log(e);
    }
  })

  it(`setFioDomainVisibility false`, async () => {
    const result = await fioSdk.genericAction('setFioDomainVisibility', {
      fioDomain: newFioDomain,
      isPublic: false,
      maxFee: defaultFee,
      technologyProviderId: ''
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
      technologyProviderId: ''
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getFee for transferFioDomain`, async () => {
    const result = await fioSdk.genericAction('getFeeForTransferFioDomain', {
      fioAddress: newFioAddress
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`Transfer fio domain`, async () => {
    const result = await fioSdk.genericAction('transferFioDomain', {
      fioDomain: newFioDomain,
      newOwnerKey: pubKeyForTransfer,
      maxFee: defaultFee
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getFee for addBundledTransactions`, async () => {
    const result = await fioSdk.genericAction('getFeeForAddBundledTransactions', {
      fioAddress: newFioAddress
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`add Bundled Transactions`, async () => {
    const result = await fioSdk.genericAction('addBundledTransactions', {
      fioAddress: newFioAddress,
      bundleSets: defaultBundledSets,
      maxFee: defaultFee
    })
    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getFee for addPublicAddress`, async () => {
    const result = await fioSdk.genericAction('getFeeForAddPublicAddress', {
      fioAddress: newFioAddress
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`Add public address`, async () => {
    const result = await fioSdk.genericAction('addPublicAddress', {
      fioAddress: newFioAddress,
      chainCode: fioChainCode,
      tokenCode: fioTokenCode,
      publicAddress: '1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs',
      maxFee: defaultFee,
      technologyProviderId: ''
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
      publicAddresses: [
        {
          chain_code: ethChainCode,
          token_code: ethTokenCode,
          public_address: 'xxxxxxyyyyyyzzzzzz',
        },
        {
          chain_code: fioChainCode,
          token_code: fioTokenCode,
          public_address: publicKey,
        }
      ],
      maxFee: defaultFee,
      technologyProviderId: ''
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })


  it(`getPublicAddress`, async () => {
    const result = await fioSdk.genericAction('getPublicAddress', {
      fioAddress: newFioAddress, chainCode: fioChainCode, tokenCode: fioTokenCode
    })

    expect(result.public_address).to.be.a('string')
  })


  it(`getPublicAddresses`, async () => {
    const result = await fioSdk.genericAction('getPublicAddresses', {
      fioAddress: newFioAddress, limit: 10, offset: 0
    })

    expect(result).to.have.all.keys('public_addresses', 'more')
    expect(result.public_addresses).to.be.a('array')
    expect(result.more).to.be.a('boolean')
  })

  it(`getFee for removePublicAddresses`, async () => {
    const result = await fioSdk.genericAction('getFeeForRemovePublicAddresses', {
      fioAddress: newFioAddress
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`Remove public addresses`, async () => {
    const result = await fioSdk.genericAction('removePublicAddresses', {
      fioAddress: newFioAddress,
      publicAddresses: [
        {
          chain_code: ethChainCode,
          token_code: ethTokenCode,
          public_address: 'xxxxxxyyyyyyzzzzzz',
        }
      ],
      maxFee: defaultFee,
      technologyProviderId: ''
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getFee for removeAllPublicAddresses`, async () => {

    const result = await fioSdk.genericAction('getFeeForRemoveAllPublicAddresses', {
      fioAddress: newFioAddress
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`Remove all public addresses`, async () => {
    await fioSdk.genericAction('addPublicAddresses', {
      fioAddress: newFioAddress,
      publicAddresses: [
        {
          chain_code: ethChainCode,
          token_code: ethTokenCode,
          public_address: 'xxxxxxyyyyyyzzzzzz1',
        }
      ],
      maxFee: defaultFee,
      technologyProviderId: ''
    })

    const result = await fioSdk.genericAction('removeAllPublicAddresses', {
      fioAddress: newFioAddress,
      maxFee: defaultFee,
      technologyProviderId: ''
    })
    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`isAvailable true`, async () => {
    const result = await fioSdk.genericAction('isAvailable', {
      fioName: generateTestingFioAddress(),
    })

    expect(result.is_registered).to.equal(0)
  })

  it(`isAvailable false`, async () => {
    const result = await fioSdk.genericAction('isAvailable', {
      fioName: testFioAddressName
    })

    expect(result.is_registered).to.equal(1)
  })

  it(`getFioBalance for custom fioPublicKey`, async () => {
    const result = await fioSdk.genericAction('getFioBalance', {
      fioPublicKey: publicKey2
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
      endPoint: 'register_fio_address',
      fioAddress: ''
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`getMultiplier`, async () => {
    const result = await fioSdk.genericAction('getMultiplier', {})

    expect(result).to.be.a('number')
  })

  it(`getFee for transferFioAddress`, async () => {
    const result = await fioSdk.genericAction('getFeeForTransferFioAddress', {
      fioAddress: newFioAddress
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`Transfer fio address`, async () => {
    const result = await fioSdk.genericAction('transferFioAddress', {
      fioAddress: newFioAddress,
      newOwnerKey: publicKey2,
      maxFee: defaultFee
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getFee for BurnFioAddress`, async () => {
    const result = await fioSdk.genericAction('getFeeForBurnFioAddress', {
      fioAddress: newFioAddress
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`Burn fio address`, async () => {
    try {
      const result = await fioSdk2.genericAction('burnFioAddress', {
        fioAddress: newFioAddress,
        ownerKey: publicKey2,
        maxFee: defaultFee
      })

      expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
      expect(result.status).to.be.a('string')
      expect(result.fee_collected).to.be.a('number')
      expect(result.block_num).to.be.a('number')
      expect(result.transaction_id).to.be.a('string')
    } catch (e) {
      console.log(e);
    }
  })

  // Uncomment when Get Account Public Key will be available on testnet servers
  // let accountName;

  // it(`accountHash`, async () => {
  //   accountName = FIOSDK.accountHash(publicKey).accountnm;
  // });

  // it(`Get Account Public Key`, async () => {
  //   const result = await fioSdk.genericAction('getAccountPubKey', {
  //     account: accountName
  //   });

  //   expect(result.fio_public_key).to.be.a('string')
  // })

  // Uncomment when Get Ecrypted Key will be available on testnet servers
  
  // it(`Get Ecrypted Key`, async () => {
  //   const result = await fioSdk.genericAction('getEncryptKey', {
  //     fioAddress: newFioAddress,
  //   });

  //   expect(result.encrypt_public_key).to.be.a('string');
  // });
})

describe('Test addaddress on account with permissions', () => {
  const account1 = FIOSDK.accountHash(publicKey).accountnm;
  const account2 = FIOSDK.accountHash(publicKey2).accountnm;

  const permissionName = 'addmyadd'; // Must be < 12 chars

  it(`user1 creates addmyadd permission and assigns to user2`, async () => {
    try {
      const authorization_object = {
        threshold: 1,
        accounts: [
          {
            permission: {
              actor: account2,
              permission: 'active',
            },
            weight: 1,
          },
        ],
        keys: [],
        waits: [],
      };

      const result = await fioSdk.genericAction('pushTransaction', {
        action: 'updateauth',
        account: 'eosio',
        actor: account1,
        data: {
          permission: permissionName, //addmyadd
          parent: 'active',
          max_fee: defaultFee,
          auth: authorization_object,
          account: account1,
        },
      });

      expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time')
      expect(result.block_num).to.be.a('number')
      expect(result.transaction_id).to.be.a('string')
    } catch (e) {
      console.log(e);
    }
  });

  it(`user1 links regmyadd permission to regaddress`, async () => {
    try {
      const result = await fioSdk.genericAction('pushTransaction', {
        action: 'linkauth',
        account: 'eosio',
        actor: account1,
        data: {
          account: account1, // the owner of the permission to be linked, this account will sign the transaction
          code: 'fio.address', // the contract owner of the action to be linked
          type: 'addaddress', // the action to be linked
          requirement: permissionName, // the name of the custom permission (created by updateauth)
          max_fee: defaultFee,
        },
      });
      
      expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time')
      expect(result.block_num).to.be.a('number')
      expect(result.transaction_id).to.be.a('string')
    } catch (e) {
      console.log(e);
    }
  });

  it(`renewdomain for user1`, async () => {
    try {
      const result = await fioSdk.genericAction('pushTransaction', {
        action: 'renewdomain',
        account: 'fio.address',
        authPermission: 'active',
        data: {
          fio_domain: testFioDomainName,
          max_fee: defaultFee,
          tpid: '',
          actor: account1,
        },
      });

      expect(result.status).to.equal('OK');
    } catch (e) {
      console.log(e);
    }
  });

  /* todo uncomment when the permissions go live in test net
  it(`addaddress as user2`, async () => {
    try {
      const result = await fioSdk.genericAction('pushTransaction', {
        action: 'addaddress',
        account: 'fio.address',
        signingAccount: account2,
        authPermission: permissionName,
        data: {
          fio_address: testFioAddressName,
          public_addresses: [
            {
              chain_code: 'BCH',
              token_code: 'BCH',
              public_address:
                'bitcoincash:qzf8zha74ahdh9j0xnwlffdn0zuyaslx3c90q7n9g9',
            },
          ],
          max_fee: defaultFee,
          tpid: '',
          actor: account1,
        },
      });
      console.log('Result: ', result);
      expect(result.status).to.equal('OK');
    } catch (e) {
      console.log(e);
    }
  });
  */
});

/* todo uncomment when the permissions go live in test net
describe('Testing Fio permissions', () => {

  let accountName, accountName2;
  let newFioDomain;
  const let permName = "register_address_on_domain";

  it(`create new domain and register to user 1`, async () => {

    accountName = FIOSDK.accountHash(publicKey).accountnm;
    accountName2 = FIOSDK.accountHash(publicKey2).accountnm;
    newFioDomain = generateTestingFioDomain()
    const result = await fioSdk.genericAction('registerFioDomain', {fioDomain: newFioDomain, maxFee: defaultFee})
    expect(result.status).to.equal('OK')
  })

  it(`First call addperm, user1 adds permission to user2 to register addresses on user1 domain `, async () => {

      const result = await fioSdk.genericAction('pushTransaction', {
        action: 'addperm',
        account: 'fio.perms',
        data: {
          grantee_account: accountName2,
          permission_name: permName,
          permission_info: "",
          object_name: newFioDomain,
          max_fee: defaultFee,
          tpid: '',
          actor: fioSdk.account
        }
      })

      expect(result.status).to.equal('OK')
  })

  it(`getGranteePermissions user2 account `, async () => {
    const result = await fioSdk.genericAction('getGranteePermissions', {granteeAccount: accountName2})
    expect(result).to.have.keys("more","permissions");
    expect(result.permissions[0]).to.have.keys("grantee_account","permission_name",
        "permission_info","object_name","grantor_account");
  })

  it(`getGrantorPermissions user1 account `, async () => {
    const result = await fioSdk.genericAction('getGrantorPermissions', {grantorAccount: accountName})
    expect(result).to.have.keys("more","permissions");
    expect(result.permissions[0]).to.have.keys("grantee_account","permission_name",
        "permission_info","object_name","grantor_account");
  })


  it(`getObjectPermissions user1 domain and "register_address_on_domain" permission `, async () => {
    const result = await fioSdk.genericAction('getObjectPermissions', {permissionName: permName,
      objectName: newFioDomain})
    expect(result).to.have.keys("more","permissions");
    expect(result.permissions[0]).to.have.keys("grantee_account","permission_name",
        "permission_info","object_name","grantor_account");
  })

})
*/

/* todo uncomment when auth fixes go live
describe('Test addaddress on account with permissions', () => {


  let account1, account2;

  it(`gen account names`, async () => {
    account1 = FIOSDK.accountHash(publicKey).accountnm;
    account2 = FIOSDK.accountHash(publicKey2).accountnm;
  })


  const permissionName = 'addmyadd'; // Must be < 12 chars

  it(`user1 creates addmyadd permission and assigns to user2`, async () => {
     try{
       const authorization_object = {
        threshold: 1,
        accounts: [
          {
            permission: {
              actor: account2,
              permission: 'active',
            },
            weight: 1,
          },
        ],
        keys: [],
        waits: [],
      };

      const result = await fioSdk.genericAction('pushTransaction', {
        action: 'updateauth',
        account: 'eosio',
        actor: account1,
        data: {
          permission: permissionName,
          parent: 'active',
          auth: authorization_object,
          max_fee: defaultFee,
          account: account1,
        },
      });

      //console.log(result);
      expect(result).to.have.all.keys(
        'transaction_id',
        'block_num',
        'block_time'
      );

      expect(result.block_num).to.be.a('number');
      expect(result.transaction_id).to.be.a('string');
    } catch (e) {
      console.log('Error' ,e);
    }
  });




  it(`user1 links regmyadd permission to regaddress`, async () => {
    try {
      const result = await fioSdk.genericAction('pushTransaction', {
        action: 'linkauth',
        account: 'eosio',
        actor: account1,
        data: {
          account: account1, // the owner of the permission to be linked, this account will sign the transaction
          code: 'fio.address', // the contract owner of the action to be linked
          type: 'addaddress', // the action to be linked
          requirement: permissionName, // the name of the custom permission (created by updateauth)
          max_fee: defaultFee,
        },
      });

      expect(result).to.have.all.keys(
        'transaction_id',
        'block_num',
        'block_time'
      );
      expect(result.block_num).to.be.a('number');
      expect(result.transaction_id).to.be.a('string');
    } catch (e) {
      //the error we get here is due to using the same account every time we run the test,
      //we get an error "same as previous" from linkauth, this is ok!
     // console.log(e);
    }
  });

  it(`renewdomain for user1`, async () => {
    try {
      const result = await fioSdk.genericAction('pushTransaction', {
        action: 'renewdomain',
        account: 'fio.address',
        authPermission: 'active',
        data: {
          fio_domain: testFioDomainName,
          max_fee: defaultFee,
          tpid: '',
          actor: account1
        },
      });

      expect(result.status).to.equal('OK');
    } catch (e) {
      console.log(e);
    }
  });

  it(`addaddress as user2`, async () => {
    try {
      const result = await fioSdk2.genericAction('pushTransaction', {
        action: 'addaddress',
        account: 'fio.address',
        signingAccount: account2,
        authPermission: permissionName,
        data: {
          fio_address: testFioAddressName,
          public_addresses: [
            {
              chain_code: 'BCH',
              token_code: 'BCH',
              public_address:
                'bitcoincash:qzf8zha74ahdh9j0xnwlffdn0zuyaslx3c90q7n9g9',
            },
          ],
          max_fee: defaultFee,
          tpid: '',
          actor: account1,
        },
      });

      expect(result.status).to.equal('OK');
    } catch (e) {
      console.log(e);
    }
  });
});
 */

describe('Staking tests', () => {
  let stakedBalance = 0;
  const stakeAmount = FIOSDK.amountToSUF(5);
  const unStakeAmount = FIOSDK.amountToSUF(2);

  it(`Stake`, async () => {
    try {
      const { staked } = await fioSdk.genericAction('getFioBalance', {});
      stakedBalance = staked;

      const result = await fioSdk.genericAction('stakeFioTokens', {
        amount: stakeAmount,
        fioAddress: testFioAddressName,
        technologyProviderId: stakingTPID,
      })

      //expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
      expect(result.status).to.be.a('string')
      expect(result.fee_collected).to.be.a('number')
      expect(result.block_num).to.be.a('number')
      expect(result.transaction_id).to.be.a('string')
    } catch (e) {
      console.log(e);
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
      technologyProviderId: stakingTPID,
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
})

describe('NFT tests', () => {

  const contractAddress1 = `0x63c0691d05f45ca${Date.now()}`
  const tokenId1 = Date.now()
  const contractAddress2 = `atomicassets${Date.now()}`
  const tokenId2 = Date.now() + 4
  const hash = generateHashForNft()

  it(`Sign NFT`, async () => {
    const result = await fioSdk.genericAction('pushTransaction', {
      action: 'addnft',
      account: 'fio.address',
      data: {
        fio_address: testFioAddressName,
        nfts: [
          {
            chain_code: "ETH",
            contract_address: contractAddress1,
            token_id: tokenId1,
            url: "ipfs://ipfs/QmZ15eQX8FPjfrtdX3QYbrhZxJpbLpvDpsgb2p3VEH8Bqq",
            hash,
            metadata: ""
          },
          {
            chain_code: "EOS",
            contract_address: contractAddress2,
            token_id: tokenId2,
            url: "",
            hash: "",
            metadata: "{'creator_url':'https://yahoo.com/'}"
          }
        ],
        max_fee: defaultFee,
        tpid: ''
      }
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getNfts by chain code and contract address`, async () => {
    await timeout(2000)
    const ccResult = await fioSdk.getNfts({
      chainCode: 'ETH',
      contractAddress: contractAddress1
    }, 10, 0)

    expect(ccResult).to.have.all.keys('nfts', 'more')
    expect(ccResult.nfts).to.be.a('array')
    expect(ccResult.more).to.be.a('number')
    expect(ccResult.nfts[0].fio_address).to.be.a('string')
    expect(ccResult.nfts[0].fio_address).to.equal(testFioAddressName)
    expect(ccResult.nfts[0].contract_address).to.equal(contractAddress1)
  })

  it(`getNfts by FIO Address`, async () => {
    const fioAddressResult = await fioSdk.getNfts({ fioAddress: testFioAddressName }, 10, 0)

    expect(fioAddressResult).to.have.all.keys('nfts', 'more')
    expect(fioAddressResult.nfts).to.be.a('array')
    expect(fioAddressResult.more).to.be.a('number')
    expect(fioAddressResult.nfts.length).to.gte(2)
  })

  it(`getNfts by hash`, async () => {
    const hashResult = await fioSdk.getNfts({
      hash
    }, 10, 0)

    expect(hashResult).to.have.all.keys('nfts', 'more')
    expect(hashResult.nfts).to.be.a('array')
    expect(hashResult.more).to.be.a('number')
    expect(hashResult.nfts[0].hash).to.be.a('string')
    expect(hashResult.nfts[0].hash).to.equal(hash)
  })
})

describe('Request funds, approve and send', () => {
  const fundsAmount = 3
  let requestId
  const memo = 'testing fund request'

  it(`getFee for requestFunds`, async () => {
    const result = await fioSdk.genericAction('getFeeForNewFundsRequest', {
      payeeFioAddress: testFioAddressName2
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`requestFunds`, async () => {
    const result = await fioSdk2.genericAction('requestFunds', {
      payerFioAddress: testFioAddressName,
      payeeFioAddress: testFioAddressName2,
      payeeTokenPublicAddress: publicKey2,
      amount: fundsAmount,
      chainCode: fioChainCode,
      tokenCode: fioTokenCode,
      memo: '',
      maxFee: defaultFee,
      payerFioPublicKey: publicKey,
      technologyProviderId: '',
      hash: '',
      offLineUrl: ''
    })
    //console.log('requestFunds: ', result)
    requestId = result.fio_request_id
    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fio_request_id', 'fee_collected')
    expect(result.fio_request_id).to.be.a('number')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getPendingFioRequests`, async () => {
    await timeout(4000)
    const result = await fioSdk.genericAction('getPendingFioRequests', {})
    expect(result).to.have.all.keys('requests', 'more')
    expect(result.requests).to.be.a('array')
    expect(result.more).to.be.a('number')
    const pendingReq = result.requests.find(pr => parseInt(pr.fio_request_id) === parseInt(requestId))
    expect(pendingReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'time_stamp', 'content')
    expect(pendingReq.fio_request_id).to.be.a('number')
    expect(pendingReq.fio_request_id).to.equal(requestId)
    expect(pendingReq.payer_fio_address).to.be.a('string')
    expect(pendingReq.payer_fio_address).to.equal(testFioAddressName)
    expect(pendingReq.payee_fio_address).to.be.a('string')
    expect(pendingReq.payee_fio_address).to.equal(testFioAddressName2)
  })

  it(`getSentFioRequests`, async () => {
    const result = await fioSdk2.genericAction('getSentFioRequests', {})
    expect(result).to.have.all.keys('requests', 'more')
    expect(result.requests).to.be.a('array')
    expect(result.more).to.be.a('number')
    const pendingReq = result.requests.find(pr => parseInt(pr.fio_request_id) === parseInt(requestId))
    expect(pendingReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
    expect(pendingReq.fio_request_id).to.be.a('number')
    expect(pendingReq.fio_request_id).to.equal(requestId)
    expect(pendingReq.payer_fio_address).to.be.a('string')
    expect(pendingReq.payer_fio_address).to.equal(testFioAddressName)
    expect(pendingReq.payee_fio_address).to.be.a('string')
    expect(pendingReq.payee_fio_address).to.equal(testFioAddressName2)
  })

  it(`recordObtData`, async () => {
    await fioSdk.genericAction('transferTokens', {
      payeeFioPublicKey: publicKey2,
      amount: fundsAmount,
      maxFee: defaultFee,
    })
    const result = await fioSdk.genericAction('recordObtData', {
      fioRequestId: requestId,
      payerFioAddress: testFioAddressName,
      payeeFioAddress: testFioAddressName2,
      payerTokenPublicAddress: publicKey,
      payeeTokenPublicAddress: publicKey2,
      amount: fundsAmount,
      chainCode: fioChainCode,
      tokenCode: fioTokenCode,
      status: 'sent_to_blockchain',
      obtId: '',
      maxFee: defaultFee,
    })
    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getReceivedFioRequests`, async () => {
    await timeout(4000)
    const result = await fioSdk.genericAction('getReceivedFioRequests', {})
    expect(result).to.have.all.keys('requests', 'more')
    expect(result.requests).to.be.a('array')
    expect(result.more).to.be.a('number')
    const pendingReq = result.requests.find(pr => parseInt(pr.fio_request_id) === parseInt(requestId))
    expect(pendingReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'time_stamp', 'content', 'status')
    expect(pendingReq.fio_request_id).to.be.a('number')
    expect(pendingReq.fio_request_id).to.equal(requestId)
    expect(pendingReq.payer_fio_address).to.be.a('string')
    expect(pendingReq.payer_fio_address).to.equal(testFioAddressName)
    expect(pendingReq.payee_fio_address).to.be.a('string')
    expect(pendingReq.payee_fio_address).to.equal(testFioAddressName2)
  })

  it(`Payer getObtData`, async () => {
    await timeout(10000)
    const result = await fioSdk.genericAction('getObtData', {})
    expect(result).to.have.all.keys('obt_data_records', 'more')
    expect(result.obt_data_records).to.be.a('array')
    expect(result.more).to.be.a('number')
    const obtData = result.obt_data_records.find(pr => parseInt(pr.fio_request_id) === parseInt(requestId))
    expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
    expect(obtData.fio_request_id).to.be.a('number')
    expect(obtData.fio_request_id).to.equal(requestId)
    expect(obtData.payer_fio_address).to.be.a('string')
    expect(obtData.payer_fio_address).to.equal(testFioAddressName)
    expect(obtData.payee_fio_address).to.be.a('string')
    expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
  })

  it(`Payee getObtData`, async () => {
    const result = await fioSdk2.genericAction('getObtData', {})
    expect(result).to.have.all.keys('obt_data_records', 'more')
    expect(result.obt_data_records).to.be.a('array')
    expect(result.more).to.be.a('number')
    const obtData = result.obt_data_records.find(pr => parseInt(pr.fio_request_id) === parseInt(requestId))
    expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
    expect(obtData.fio_request_id).to.be.a('number')
    expect(obtData.fio_request_id).to.equal(requestId)
    expect(obtData.payer_fio_address).to.be.a('string')
    expect(obtData.payer_fio_address).to.equal(testFioAddressName)
    expect(obtData.payee_fio_address).to.be.a('string')
    expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
  })

})


describe('Request funds, cancel funds request', () => {
  const fundsAmount = 3
  let requestId
  const memo = 'testing fund request'

  it(`requestFunds`, async () => {
    const result = await fioSdk2.genericAction('requestFunds', {
      payerFioAddress: testFioAddressName,
      payeeFioAddress: testFioAddressName2,
      payeePublicAddress: testFioAddressName2,
      amount: fundsAmount,
      chainCode: fioChainCode,
      tokenCode: fioTokenCode,
      memo,
      maxFee: defaultFee,
    })

    requestId = result.fio_request_id
    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fio_request_id', 'fee_collected')
    expect(result.fio_request_id).to.be.a('number')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`cancel request`, async () => {
    try {
      const result = await fioSdk2.genericAction('cancelFundsRequest', {
        fioRequestId: requestId,
        maxFee: defaultFee,
        tpid: ''
      })
      expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
      expect(result.status).to.be.a('string')
      expect(result.fee_collected).to.be.a('number')
      expect(result.block_num).to.be.a('number')
      expect(result.transaction_id).to.be.a('string')
    } catch (e) {
      console.log(e);
    }
  })


  it(`getCancelledFioRequests`, async () => {
    try {
      await timeout(4000)
      const result = await fioSdk2.genericAction('getCancelledFioRequests', {})
      expect(result).to.have.all.keys('requests', 'more')
      expect(result.requests).to.be.a('array')
      expect(result.more).to.be.a('number')
      const pendingReq = result.requests.find(pr => parseInt(pr.fio_request_id) === parseInt(requestId))
      expect(pendingReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'time_stamp', 'content', 'status')
      expect(pendingReq.fio_request_id).to.be.a('number')
      expect(pendingReq.fio_request_id).to.equal(requestId)
      expect(pendingReq.payer_fio_address).to.be.a('string')
      expect(pendingReq.payer_fio_address).to.equal(testFioAddressName)
      expect(pendingReq.payee_fio_address).to.be.a('string')
      expect(pendingReq.payee_fio_address).to.equal(testFioAddressName2)
      expect(pendingReq.content.memo).to.be.equal(memo);
    } catch (e) {
      console.log(e);
    }
  })

})


describe('Request funds, reject', () => {
  const fundsAmount = 4
  let requestId
  const memo = 'testing fund request'

  it(`requestFunds`, async () => {
    const result = await fioSdk2.genericAction('requestFunds', {
      payerFioAddress: testFioAddressName,
      payeeFioAddress: testFioAddressName2,
      payeePublicAddress: testFioAddressName2,
      amount: fundsAmount,
      chainCode: fioChainCode,
      tokenCode: fioTokenCode,
      memo,
      maxFee: defaultFee,
    })

    requestId = result.fio_request_id
    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fio_request_id', 'fee_collected')
    expect(result.fio_request_id).to.be.a('number')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getPendingFioRequests`, async () => {
    await timeout(4000)
    const result = await fioSdk.genericAction('getPendingFioRequests', {})

    expect(result).to.have.all.keys('requests', 'more')
    expect(result.requests).to.be.a('array')
    expect(result.more).to.be.a('number')
    const pendingReq = result.requests.find(pr => parseInt(pr.fio_request_id) === parseInt(requestId))
    expect(pendingReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'time_stamp', 'content')
    expect(pendingReq.fio_request_id).to.be.a('number')
    expect(pendingReq.fio_request_id).to.equal(requestId)
    expect(pendingReq.payer_fio_address).to.be.a('string')
    expect(pendingReq.payer_fio_address).to.equal(testFioAddressName)
    expect(pendingReq.payee_fio_address).to.be.a('string')
    expect(pendingReq.payee_fio_address).to.equal(testFioAddressName2)
    expect(pendingReq.content.memo).to.be.equal(memo);
  })

  it(`getFee for rejectFundsRequest`, async () => {
    const result = await fioSdk.genericAction('getFeeForRejectFundsRequest', {
      payerFioAddress: testFioAddressName2
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`rejectFundsRequest`, async () => {
    const result = await fioSdk.genericAction('rejectFundsRequest', {
      fioRequestId: requestId,
      maxFee: defaultFee,
    })

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

})

describe('Transfer tokens', () => {
  const fundsAmount = FIOSDK.SUFUnit
  let fioBalance = 0
  let fioBalanceAfter = 0

  it(`Check balance before transfer`, async () => {
    const result = await fioSdk2.genericAction('getFioBalance', {})

    fioBalance = result.balance
  })

  it(`Transfer tokens`, async () => {
    const result = await fioSdk.genericAction('transferTokens', {
      payeeFioPublicKey: publicKey2,
      amount: fundsAmount,
      maxFee: defaultFee,
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
})

describe('Record obt data, check', () => {
  const obtId = generateObtId()
  const fundsAmount = 4.5

  it(`getFee for recordObtData`, async () => {
    const result = await fioSdk.genericAction('getFeeForRecordObtData', {
      payerFioAddress: testFioAddressName
    })

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`recordObtData`, async () => {
    const result = await fioSdk.genericAction('recordObtData', {
      fioRequestId: '',
      payerFioAddress: testFioAddressName,
      payeeFioAddress: testFioAddressName2,
      payerTokenPublicAddress: publicKey,
      payeeTokenPublicAddress: publicKey2,
      amount: fundsAmount,
      chainCode: fioChainCode,
      tokenCode: fioTokenCode,
      status: 'sent_to_blockchain',
      obtId,
      maxFee: defaultFee,
    })
    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`Payer getObtData`, async () => {
    await timeout(4000)
    const result = await fioSdk.genericAction('getObtData', { tokenCode: fioTokenCode })
    expect(result).to.have.all.keys('obt_data_records', 'more')
    expect(result.obt_data_records).to.be.a('array')
    expect(result.more).to.be.a('number')
    const obtData = result.obt_data_records.find(pr => pr.content.obt_id === obtId)
    expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
    expect(obtData.content.obt_id).to.be.a('string')
    expect(obtData.content.obt_id).to.equal(obtId)
    expect(obtData.payer_fio_address).to.be.a('string')
    expect(obtData.payer_fio_address).to.equal(testFioAddressName)
    expect(obtData.payee_fio_address).to.be.a('string')
    expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
  })

  it(`Payee getObtData`, async () => {
    const result = await fioSdk2.genericAction('getObtData', { tokenCode: fioTokenCode })
    expect(result).to.have.all.keys('obt_data_records', 'more')
    expect(result.obt_data_records).to.be.a('array')
    expect(result.more).to.be.a('number')
    const obtData = result.obt_data_records.find(pr => pr.content.obt_id === obtId)
    expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
    expect(obtData.content.obt_id).to.be.a('string')
    expect(obtData.content.obt_id).to.equal(obtId)
    expect(obtData.payer_fio_address).to.be.a('string')
    expect(obtData.payer_fio_address).to.equal(testFioAddressName)
    expect(obtData.payee_fio_address).to.be.a('string')
    expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
  })
})

describe('Encrypting/Decrypting', () => {
  const alicePrivateKey = '5J35xdLtcPvDASxpyWhNrR2MfjSZ1xjViH5cvv15VVjqyNhiPfa'
  const alicePublicKey = 'FIO6NxZ7FLjjJuHGByJtNJQ1uN1P5X9JJnUmFW3q6Q7LE7YJD4GZs'
  const bobPrivateKey = '5J37cXw5xRJgE869B5LxC3FQ8ZJECiYnsjuontcHz5cJsz5jhb7'
  const bobPublicKey = 'FIO4zUFC29aq8uA4CnfNSyRZCnBPya2uQk42jwevc3UZ2jCRtepVZ'

  const nonPartyPrivateKey = '5HujRtqceTPo4awwHAEdHRTWdMTgA6s39dJjwWcjhNdSjVWUqMk'
  const nonPartyPublicKey = 'FIO5mh1UqE5v9TKdYm2Ro6JXCXpSxj1Sm4vKUeydaLd7Cu5aqiSSp'
  const NEW_FUNDS_CONTENT = 'new_funds_content'
  const RECORD_OBT_DATA_CONTENT = 'record_obt_data_content'

  let fioSDKBob = new FIOSDK(
    bobPrivateKey,
    bobPublicKey,
    baseUrls,
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

    const cipherContent = fioSDKBob.transactions.getCipherContent(NEW_FUNDS_CONTENT, content, bobPrivateKey, alicePublicKey)
    expect(cipherContent).to.be.a('string')

    const uncipherContent = fioSDKBob.transactions.getUnCipherContent(NEW_FUNDS_CONTENT, cipherContent, alicePrivateKey, bobPublicKey)
    expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

    // same party, ensure cannot decipher
    try {
      const uncipherContentSameParty = fioSDKBob.transactions.getUnCipherContent(NEW_FUNDS_CONTENT, cipherContent, alicePrivateKey, alicePublicKey)
      expect(uncipherContentSameParty.payee_public_address).to.notequal(bobPublicKey)
    } catch (e) {

    }

    // non party, ensure cannot decipher
    try {
      const uncipherContentNonParty = fioSDKBob.transactions.getUnCipherContent(NEW_FUNDS_CONTENT, cipherContent, nonPartyPrivateKey, bobPublicKey)
      expect(uncipherContentNonParty.payee_public_address).to.notequal(bobPublicKey)
    } catch (e) {

    }

    try {
      const uncipherContentNonPartyA = fioSDKBob.transactions.getUnCipherContent(NEW_FUNDS_CONTENT, cipherContent, bobPrivateKey, nonPartyPublicKey)
      expect(uncipherContentNonPartyA.payee_public_address).to.notequal(bobPublicKey)
    } catch (e) {

    }

  })

  it(`Decrypt from iOS SDK - Request New Funds`, async () => {
    const cipherContent = 'iNz623p8SjbFG3rNbxLeVzQhs7n4aB8UGHvkF08HhBXD3X9g6bVFJl93j/OqYdkiycxShF64uc9OHFc/qbOeeS8+WVL2YRpd9JaRqdTUE9XKFPZ6lETQ7MTbGT+qppMoJ0tWCP6mWL4M9V1xu6lE3lJkuRS4kXnwtOUJOcBDG7ddFyHaV1LnLY/jnOJHJhm8'
    expect(cipherContent).to.be.a('string')

    const uncipherContent = fioSDKBob.transactions.getUnCipherContent(NEW_FUNDS_CONTENT, cipherContent, alicePrivateKey, bobPublicKey)
    expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

    const uncipherContentA = fioSDKBob.transactions.getUnCipherContent(NEW_FUNDS_CONTENT, cipherContent, bobPrivateKey, alicePublicKey)
    expect(uncipherContentA.payee_public_address).to.equal(bobPublicKey)

  })

  it(`Decrypt from Kotlin SDK - Request New Funds`, async () => {
    const cipherContent = 'PUEe6pA4HAl7EHA1XFRqJPMjrugD0ZT09CDx4/rH3ktwqo+WaoZRIuqXR4Xvr6ki1XPp7KwwSy6GqPUuBRuBS8Z8c0/xGgcDXQHJuYSsaV3d9Q61W1JeCDvsSIOdd3MTzObNJNcMj3gad+vPcOvJ7BojeufUoe0HQvxjXO+Gpp20UPdQnljLVsir+XuFmreZwMLWfggIovd0A9t438o+DA=='
    expect(cipherContent).to.be.a('string')

    const uncipherContent = fioSDKBob.transactions.getUnCipherContent(NEW_FUNDS_CONTENT, cipherContent, alicePrivateKey, bobPublicKey)
    expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

    const uncipherContentA = fioSDKBob.transactions.getUnCipherContent(NEW_FUNDS_CONTENT, cipherContent, bobPrivateKey, alicePublicKey)
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

    const cipherContent = fioSDKBob.transactions.getCipherContent(RECORD_OBT_DATA_CONTENT, content, bobPrivateKey, alicePublicKey)
    expect(cipherContent).to.be.a('string')

    const uncipherContent = fioSDKBob.transactions.getUnCipherContent(RECORD_OBT_DATA_CONTENT, cipherContent, alicePrivateKey, bobPublicKey)
    expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

    // same party, ensure cannot decipher
    try {
      const uncipherContentSameParty = fioSDKBob.transactions.getUnCipherContent(RECORD_OBT_DATA_CONTENT, cipherContent, alicePrivateKey, alicePublicKey)
      expect(uncipherContentSameParty.payee_public_address).to.notequal(bobPublicKey)
    } catch (e) {
      // successful, on failure.  Should not decrypt
    }

    // non party, ensure cannot decipher
    try {
      const uncipherContentNonParty = fioSDKBob.transactions.getUnCipherContent(RECORD_OBT_DATA_CONTENT, cipherContent, nonPartyPrivateKey, bobPublicKey)
      expect(uncipherContentNonParty.payee_public_address).to.notequal(bobPublicKey)
    } catch (e) {

    }

    try {
      const uncipherContentNonPartyA = fioSDKBob.transactions.getUnCipherContent(RECORD_OBT_DATA_CONTENT, cipherContent, bobPrivateKey, nonPartyPublicKey)
      expect(uncipherContentNonPartyA.payee_public_address).to.notequal(bobPublicKey)
    } catch (e) {

    }

  })

  it(`Decrypt from iOS SDK - RecordObtData`, async () => {
    const cipherContent = 'XJqqkHspW0zp+dHKj9TZMn5mZzdMQrdIAXNOlKPekeEpbjyeh92hO+lB9gA6wnNuq8YNLcGA1s0NPGzb+DlHzXT2tCulgk5fiQy6+8AbThPzB0N6xICmVV3Ontib8FVlTrVrqg053PK9JeHUsg0Sb+vG/dz9+ovcSDHaByxybRNhZOVBe8jlg91eakaU1H8XKDxYOtI3+jYESK02g2Rw5Ya9ec+/PnEBQ6DjkHruKDorEF1D+nDT/0CK46VsfdYzYK8IV0T9Nal4H6Bf4wrMlQ=='
    expect(cipherContent).to.be.a('string')

    const uncipherContent = fioSDKBob.transactions.getUnCipherContent(RECORD_OBT_DATA_CONTENT, cipherContent, alicePrivateKey, bobPublicKey)
    expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

    const uncipherContentA = fioSDKBob.transactions.getUnCipherContent(RECORD_OBT_DATA_CONTENT, cipherContent, bobPrivateKey, alicePublicKey)
    expect(uncipherContentA.payee_public_address).to.equal(bobPublicKey)

  })

  it(`Decrypt from Kotlin SDK - RecordObtData`, async () => {
    const cipherContent = '4IVNiV3Vg0/ZwkBywOWjSgER/aBzHypmfYoljA7y3Qf04mI/IkwPwO9+yj7EISTdRb2LEPgEDg1RsWBdAFmm6AE9ZXG1W5qPrtFNZuZw3qhCJbisnTLCPA2pEcAGKxBhhTaIx74/+OLXTNq5Z7RWWB+OUIa3bBJLHyhO79BUQ9dIsfiDVGmlRL5yq57uqRfb8FWoQraK31As/OFJ5Gj7KEYehzviJnMX7pYhE4CJkkfYYGfB4AHmHllFSMaLCrkY8BvDViQZTuniqDOua6Po51muyCaJLF5rdMSS0Za5F9U='
    expect(cipherContent).to.be.a('string')

    const uncipherContent = fioSDKBob.transactions.getUnCipherContent(RECORD_OBT_DATA_CONTENT, cipherContent, alicePrivateKey, bobPublicKey)
    expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

    const uncipherContentA = fioSDKBob.transactions.getUnCipherContent(RECORD_OBT_DATA_CONTENT, cipherContent, bobPrivateKey, alicePublicKey)
    expect(uncipherContentA.payee_public_address).to.equal(bobPublicKey)

  })

})

describe('Check prepared transaction', () => {
  it(`requestFunds prepared transaction`, async () => {
    fioSdk2.setSignedTrxReturnOption(true)
    const preparedTrx = await fioSdk2.genericAction('requestFunds', {
      payerFioAddress: testFioAddressName,
      payeeFioAddress: testFioAddressName2,
      payeePublicAddress: testFioAddressName2,
      amount: 200000,
      chainCode: fioChainCode,
      tokenCode: fioTokenCode,
      memo: 'prepared transaction',
      maxFee: defaultFee,
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
})
