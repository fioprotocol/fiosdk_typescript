/* tslint:disable:no-console */
import {expect} from 'chai'
import * as dotenv from 'dotenv'
import 'mocha'
import nodeFetch from 'node-fetch'
import {
    Account,
    Action,
    EndPoint,
    FioError,
    FIOSDK,
    FioSentItem,
    RenewFioAddressResponse,
    TransactionResponse,
} from '../lib/FIOSDK'

dotenv.config({path: ['.env.test', '.env']})

const fetchJson = async (uri: string, opts = {}) => {
    return nodeFetch(uri, opts)
}

/**
 * Please set your private/public keys and existing fioAddresses
 */
const privateKey = process.env.PRIVATE_KEY as string
const publicKey = process.env.PUBLIC_KEY as string
const privateKey2 = process.env.PRIVATE_KEY_2 as string
const publicKey2 = process.env.PUBLIC_KEY_2 as string
const testFioAddressName = process.env.TEST_FIO_ADDRESS_NAME as string
const testFioAddressName2 = process.env.TEST_FIO_ADDRESS_NAME_2 as string
const testFioDomainName = process.env.TEST_FIO_DOMAIN_NAME as string

/*
 TODO: DASH-625 Uncomment when encrypt keys will be available on testnet
 let encPrivateKey = process.env.ENC_PRIVATE_KEY,
 encPublicKey = process.env.ENC_PUBLIC_KEY,
 encPrivateKey2 = process.env.ENC_PRIVATE_KEY_2,
 encPublicKey2 = process.env.ENC_PUBLIC_KEY_2,
 encTestFioAddressName = process.env.ENC_TEST_FIO_ADDRESS_NAME,
 encTestFioAddressName2 = process.env.ENC_TEST_FIO_ADDRESS_NAME_2;
 */

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

let fioSdk: FIOSDK
let fioSdk2: FIOSDK
let fioSdkWithWrongBaseUrl: FIOSDK

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

const timeout = async (ms: number) => {
    await new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

before(async () => {
    fioSdk = new FIOSDK(privateKey, publicKey, baseUrls, fetchJson)

    await timeout(1000)
    fioSdk2 = new FIOSDK(privateKey2, publicKey2, baseUrls, fetchJson)

    fioSdkWithWrongBaseUrl = new FIOSDK(
        privateKey2,
        publicKey2,
        baseUrls,
        fetchJson,
    )

    /*
     // TODO: DASH-625 Uncomment when encrypt keys will be available on testnet
     // Additionally handle transfer tokens
     let encPrivateKeyRes = await FIOSDK.createPrivateKeyMnemonic(getMnemonic());
     encPrivateKey = encPrivateKeyRes.fioKey;
     let encPublicKeyRes = FIOSDK.derivedPublicKey(encPrivateKey);
     encPublicKey = encPublicKeyRes.publicKey;
     encFioSdk = new FIOSDK(encPrivateKey, encPublicKey, baseUrls, fetchJson);
     const encTestDomain = generateTestingFioDomain();
     encTestFioAddressName = generateTestingFioAddress(encTestDomain);

     let encPrivateKeyRes2 = await FIOSDK.createPrivateKeyMnemonic(
     getMnemonic()
     );
     encPrivateKey2 = encPrivateKeyRes2.fioKey;
     let encPublicKeyRes2 = FIOSDK.derivedPublicKey(encPrivateKey2);
     encPublicKey2 = encPublicKeyRes2.publicKey;
     encFioSdk2 = new FIOSDK(encPrivateKey2, encPublicKey2, baseUrls, fetchJson);
     const encTestDomain2 = generateTestingFioDomain();
     encTestFioAddressName2 = generateTestingFioAddress(encTestDomain2);
     */

    try {
        const isAvailableResult = await fioSdk.genericAction('isAvailable', {
            fioName: testFioAddressName,
        })
        if (!isAvailableResult.is_registered) {
            await fioSdk.genericAction('registerFioAddress', {
                fioAddress: testFioAddressName,
                maxFee: defaultFee,
            })
        }
    } catch (e) {
        console.log(e)
    }
    try {
        const isAvailableResult2 = await fioSdk2.genericAction('isAvailable', {
            fioName: testFioAddressName2,
        })
        if (!isAvailableResult2.is_registered) {
            await fioSdk2.genericAction('registerFioAddress', {
                fioAddress: testFioAddressName2,
                maxFee: defaultFee,
            })
        }
    } catch (e) {
        console.log(e)
    }

    await timeout(4000)
})

describe('Raw Abi missing', () => {
    let consoleWarnOriginal: typeof console.warn // Store the original console.warn method
    let consoleWarnMessages: string[] = []

    beforeEach(() => {
        consoleWarnOriginal = console.warn // Store the original console.warn method
        console.warn = (...args) => {
            consoleWarnMessages.push(args.join(' '))
        }
    })

    afterEach(() => {
        console.warn = consoleWarnOriginal // Restore the original console.warn method
        consoleWarnMessages = [] // Reset the captured warning messages
    })

    it(`Get FIO Balance to test Raw Abi`, async () => {
        FIOSDK.setCustomRawAbiAccountName('fio.absentabi')

        const result = await fioSdk.genericAction('getFioBalance', {})

        const fioSdkAbiWarning = consoleWarnMessages.find((message) =>
            message.includes('FIO_SDK ABI WARNING:'),
        )

        FIOSDK.setCustomRawAbiAccountName(null)

        expect(fioSdkAbiWarning).to.exist('Not warning')

        expect(result).to.have.all.keys('balance', 'available', 'staked', 'srps', 'roe')
        expect(result.balance).to.be.a('number')
        expect(result.available).to.be.a('number')
        expect(result.staked).to.be.a('number')
        expect(result.srps).to.be.a('number')
        expect(result.roe).to.be.a('string')
    })
})

describe('Testing request timeout on wrong url', () => {
    it(`Get Fio Balance with wrong base url`, async () => {
        try {
            fioSdkWithWrongBaseUrl.setApiUrls([wrongBaseUrl])
            await fioSdkWithWrongBaseUrl.genericAction('getFioBalance', {})
        } catch (e) {
            expect(e instanceof FioError).to.true('Validation error')
            if (e instanceof FioError) {
                expect(e.message).to.match(/request_timeout|ENOTFOUND/)
            }
        }
    })

    it(`Get Fio Balance with 2 wrong base urls`, async () => {
        try {
            fioSdkWithWrongBaseUrl.setApiUrls([wrongBaseUrl, wrongBaseUrl2])
            await fioSdkWithWrongBaseUrl.genericAction('getFioBalance', {})
        } catch (e) {
            expect(e instanceof FioError).to.true('Validation error')
            if (e instanceof FioError) {
                expect(e.message).to.match(/request_timeout|ENOTFOUND/)
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
        fioSdkWithWrongBaseUrl.setApiUrls(baseUrls)
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
        } catch (err) {
            expect(err instanceof FioError).to.true('Validation error')
            if (err instanceof FioError) {
                expect(err.message).to.equal('Validation error')
                expect(err.list[0].message).to.equal('fioAddress is required.')
            }
        }
    })

    it(`Return back correct baseUrls`, () => {
        fioSdkWithWrongBaseUrl.setApiUrls(baseUrls)
    })
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
            expect(e instanceof FioError).to.true('Validation error')
            if (e instanceof FioError) {
                expect(e.list[0].message).to.equal('chainCode must match /^[a-z0-9]+$/i.')
            }
        }
        try {
            FIOSDK.isTokenCodeValid('')
        } catch (e) {
            expect(e instanceof FioError).to.true('Validation error')
            if (e instanceof FioError) {
                expect(e.list[0].message).to.equal('tokenCode is required.')
            }
        }
        try {
            FIOSDK.isFioAddressValid('f')
        } catch (e) {
            expect(e instanceof FioError).to.true('Validation error')
            if (e instanceof FioError) {
                expect(e.list[0].message).to.equal('fioAddress must have a length between 3 and 64.')
            }
        }
        try {
            FIOSDK.isFioDomainValid('$%FG%')
        } catch (e) {
            expect(e instanceof FioError).to.true('Validation error')
            if (e instanceof FioError) {
                expect(e.list[0].message).to.equal('fioDomain must match /^[a-zA-Z0-9]{1}(?:(?:(?!-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]+){0,1}$/i.')
            }
        }
        try {
            FIOSDK.isFioPublicKeyValid('dfsd')
        } catch (e) {
            expect(e instanceof FioError).to.true('Validation error')
            if (e instanceof FioError) {
                expect(e.list[0].message).to.equal('fioPublicKey must match /^FIO\\w+$/.')
            }
        }
        try {
            FIOSDK.isPublicAddressValid('')
        } catch (e) {
            expect(e instanceof FioError).to.true('Validation error')
            if (e instanceof FioError) {
                expect(e.list[0].message).to.equal('publicAddress is required.')
            }
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
        const result = fioSdk.genericAction('getFioPublicKey')

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
        const result = await fioSdk.genericAction('registerFioDomain', {fioDomain: newFioDomain, maxFee: defaultFee})

        expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'expiration', 'fee_collected')
        expect(result.status).to.be.a('string')
        expect(result.expiration).to.be.a('string')
        expect(result.fee_collected).to.be.a('number')
        expect(result.block_num).to.be.a('number')
        expect(result.transaction_id).to.be.a('string')
    })

    it(`Register fio domain address`, async () => {
        const result = await fioSdk.genericAction('registerFioDomainAddress', {
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

    it(`Renew fio domain`, async () => {
        const result = await fioSdk.genericAction('renewFioDomain', {fioDomain: newFioDomain, maxFee: defaultFee})

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
        const result = await fioSdk.genericAction('renewFioAddress', {fioAddress: newFioAddress, maxFee: defaultFee})

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
        const result = await fioSdk.genericAction('getFioNames', {fioPublicKey: publicKey})

        expect(result).to.have.all.keys('fio_domains', 'fio_addresses')
        expect(result.fio_domains).to.be.a('array')
        expect(result.fio_addresses).to.be.a('array')
    })

    it(`getFioDomains`, async () => {
        try {
            const result = await fioSdk.genericAction('getFioDomains', {fioPublicKey: fioSdk.publicKey})

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
            fioName: generateTestingFioAddress(),
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
        const result = await fioSdk.genericAction('getFioAddresses', {fioPublicKey: publicKey})

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
        const result = fioSdk.genericAction('getMultiplier')

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
    const account1 = FIOSDK.accountHash(publicKey).accountnm
    const account2 = FIOSDK.accountHash(publicKey2).accountnm

    const permissionName = 'addmyadd' // Must be < 12 chars

    it(`user1 creates addmyadd permission and assigns to user2`, async () => {
        try {
            const authorizationObject = {
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
                threshold: 1,
                waits: [],
            }

            const result = await fioSdk.genericAction('pushTransaction', {
                account: Account.eosio,
                action: Action.updateAuth,
                data: {
                    account: account1, // addmyadd
                    actor: account1,
                    auth: authorizationObject,
                    max_fee: defaultFee,
                    parent: 'active',
                    permission: permissionName,
                },
            }) as TransactionResponse

            expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time')
            expect(result.block_num).to.be.a('number')
            expect(result.transaction_id).to.be.a('string')
        } catch (e) {
            console.log(e)
        }
    })

    it(`user1 links regmyadd permission to regaddress`, async () => {
        try {
            const result = await fioSdk.genericAction('pushTransaction', {
                account: Account.eosio,
                action: Action.linkAuth,
                data: {
                    // the owner of the permission to be linked, this account will sign the transaction
                    account: account1,
                    actor: account1,
                    code: 'fio.address', // the contract owner of the action to be linked
                    max_fee: defaultFee, // the action to be linked
                    requirement: permissionName, // the name of the custom permission (created by updateauth)
                    type: 'addaddress',
                },
            }) as TransactionResponse

            expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time')
            expect(result.block_num).to.be.a('number')
            expect(result.transaction_id).to.be.a('string')
        } catch (e) {
            console.log(e)
        }
    })

    it(`renewdomain for user1`, async () => {
        try {
            const result = await fioSdk.genericAction('pushTransaction', {
                account: Account.address,
                action: Action.renewDomain,
                authPermission: 'active',
                data: {
                    actor: account1,
                    fio_domain: testFioDomainName,
                    max_fee: defaultFee,
                    tpid: '',
                },
            }) as TransactionResponse

            expect(result.status).to.equal('OK')
        } catch (e) {
            console.log(e)
        }
    })

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
})

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
    let stakedBalance = 0
    const stakeAmount = FIOSDK.amountToSUF(5)
    const unStakeAmount = FIOSDK.amountToSUF(2)

    it(`Stake`, async () => {
        try {
            const {staked} = await fioSdk.genericAction('getFioBalance', {})
            stakedBalance = staked

            const result = await fioSdk.genericAction('stakeFioTokens', {
                amount: stakeAmount,
                fioAddress: testFioAddressName,
                technologyProviderId: stakingTPID,
            })

            // expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
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
            technologyProviderId: stakingTPID,
        })

        expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
        expect(result.status).to.be.a('string')
        expect(result.fee_collected).to.be.a('number')
        expect(result.block_num).to.be.a('number')
        expect(result.transaction_id).to.be.a('string')
    })

    it(`Check locks`, async () => {
        const result = await fioSdk.genericAction('getLocks', {fioPublicKey: publicKey})

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
            account: Account.address,
            action: Action.addNft,
            data: {
                fio_address: testFioAddressName,
                max_fee: defaultFee,
                nfts: [
                    {
                        chain_code: 'ETH',
                        contract_address: contractAddress1,
                        hash,
                        metadata: '',
                        token_id: tokenId1,
                        url: 'ipfs://ipfs/QmZ15eQX8FPjfrtdX3QYbrhZxJpbLpvDpsgb2p3VEH8Bqq',
                    },
                    {
                        chain_code: 'EOS',
                        contract_address: contractAddress2,
                        hash: '',
                        metadata: '{\'creator_url\':\'https://yahoo.com/\'}',
                        token_id: tokenId2,
                        url: '',
                    },
                ],
                tpid: '',
            },
        }) as TransactionResponse

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
            contractAddress: contractAddress1,
        }, 10, 0)

        expect(ccResult).to.have.all.keys('nfts', 'more')
        expect(ccResult.nfts).to.be.a('array')
        expect(ccResult.more).to.be.a('number')
        expect(ccResult.nfts[0].fio_address).to.be.a('string')
        expect(ccResult.nfts[0].fio_address).to.equal(testFioAddressName)
        expect(ccResult.nfts[0].contract_address).to.equal(contractAddress1)
    })

    it(`getNfts by FIO Address`, async () => {
        const fioAddressResult = await fioSdk.getNfts({fioAddress: testFioAddressName}, 10, 0)

        expect(fioAddressResult).to.have.all.keys('nfts', 'more')
        expect(fioAddressResult.nfts).to.be.a('array')
        expect(fioAddressResult.more).to.be.a('number')
        expect(fioAddressResult.nfts.length).to.gte(2)
    })

    it(`getNfts by hash`, async () => {
        const hashResult = await fioSdk.getNfts({
            hash,
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
    let requestId: number

    it(`getFee for requestFunds`, async () => {
        const result = await fioSdk.genericAction('getFeeForNewFundsRequest', {
            payeeFioAddress: testFioAddressName2,
        })

        expect(result).to.have.all.keys('fee')
        expect(result.fee).to.be.a('number')
    })

    it(`requestFunds`, async () => {
        const result = await fioSdk2.genericAction('requestFunds', {
            amount: fundsAmount,
            chainCode: fioChainCode,
            hash: '',
            maxFee: defaultFee,
            memo: '',
            offlineUrl: '',
            payeeFioAddress: testFioAddressName2,
            payeeTokenPublicAddress: publicKey2,
            payerFioAddress: testFioAddressName,
            payerFioPublicKey: publicKey,
            technologyProviderId: '',
            tokenCode: fioTokenCode,
        })
        // console.log('requestFunds: ', result)
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
        const pendingReq = result.requests.find((pr) => pr.fio_request_id === requestId)!
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
        const pendingReq = result.requests.find((pr) => pr.fio_request_id === requestId)!
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
            amount: fundsAmount,
            maxFee: defaultFee,
            payeeFioPublicKey: publicKey2,
        })
        const result = await fioSdk.genericAction('recordObtData', {
            amount: fundsAmount,
            chainCode: fioChainCode,
            fioRequestId: requestId,
            maxFee: defaultFee,
            obtId: '',
            payeeFioAddress: testFioAddressName2,
            payeeTokenPublicAddress: publicKey2,
            payerFioAddress: testFioAddressName,
            payerTokenPublicAddress: publicKey,
            status: 'sent_to_blockchain',
            tokenCode: fioTokenCode,
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
        const pendingReq = result.requests.find((pr) => pr.fio_request_id === requestId)!
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
        const obtData = result.obt_data_records.find((pr) => pr.fio_request_id === requestId)!
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
        const obtData = result.obt_data_records.find((pr) => pr.fio_request_id === requestId)!
        expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
        expect(obtData.fio_request_id).to.be.a('number')
        expect(obtData.fio_request_id).to.equal(requestId)
        expect(obtData.payer_fio_address).to.be.a('string')
        expect(obtData.payer_fio_address).to.equal(testFioAddressName)
        expect(obtData.payee_fio_address).to.be.a('string')
        expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
    })

})

/*
 TODO: DASH-625 Uncomment when encrypt keys will be available on testnet
 describe('Request funds, approve and send with updated encrypt key', () => {
 const fundsAmount = 3;
 const requestIds = [];
 const requestIds2 = [];
 const memo = 'testing fund request with updated encrypt key';
 const memo2 = '2 testing fund request with updated encrypt key';
 const memo3 = '3 testing fund request with updated encrypt key';
 const memo4 = '4 testing fund request with updated encrypt key';
 const user1EncryptKeysMap = new Map();
 const user2EncryptKeysMap = new Map();
 let user1Account = null;
 let user2Account = null;

 let user1EncryptKeys = null,
 user1EncryptKeys2 = null,
 user2EncryptKeys = null,
 user2EncryptKeys2 = null;

 it(`Generate encrypt keys for user1`, async () => {
 let user1PrivateKeyRes1 = await FIOSDK.createPrivateKeyMnemonic(
 getMnemonic()
 );
 user1PrivateKey1 = user1PrivateKeyRes1.fioKey;
 let user1PublicKeyRes1 = FIOSDK.derivedPublicKey(user1PrivateKey1);
 user1PublicKey1 = user1PublicKeyRes1.publicKey;

 let user1PrivateKeyRes2 = await FIOSDK.createPrivateKeyMnemonic(
 getMnemonic()
 );
 user1PrivateKey2 = user1PrivateKeyRes2.fioKey;
 let user1PublicKeyRes2 = FIOSDK.derivedPublicKey(user1PrivateKey2);
 user1PublicKey2 = user1PublicKeyRes2.publicKey;

 user1EncryptKeys = {
 publicKey: user1PublicKey1,
 privateKey: user1PrivateKey1,
 };

 user1EncryptKeys2 = {
 publicKey: user1PublicKey2,
 privateKey: user1PrivateKey2,
 };
 });

 it(`Generate encrypt keys for user2`, async () => {
 let user2PrivateKeyRes1 = await FIOSDK.createPrivateKeyMnemonic(
 getMnemonic()
 );
 user2PrivateKey1 = user2PrivateKeyRes1.fioKey;
 let user2PublicKeyRes1 = FIOSDK.derivedPublicKey(user2PrivateKey1);
 user2PublicKey1 = user2PublicKeyRes1.publicKey;

 let user2PrivateKeyRes2 = await FIOSDK.createPrivateKeyMnemonic(
 getMnemonic()
 );
 user2PrivateKey2 = user2PrivateKeyRes2.fioKey;
 let user2PublicKeyRes2 = FIOSDK.derivedPublicKey(user2PrivateKey2);
 user2PublicKey2 = user2PublicKeyRes2.publicKey;

 user2EncryptKeys = {
 publicKey: user2PublicKey1,
 privateKey: user2PrivateKey1,
 };

 user2EncryptKeys2 = {
 publicKey: user2PublicKey2,
 privateKey: user2PrivateKey2,
 };
 });

 it(`Set accountHash and set encryptKeys`, async () => {
 user1Account = FIOSDK.accountHash(encFioSdk.publicKey).accountnm;
 user1EncryptKeysMap.set(user1Account, [
 user1EncryptKeys,
 user1EncryptKeys2,
 ]);

 user2Account = FIOSDK.accountHash(encFioSdk2.publicKey).accountnm;
 user2EncryptKeysMap.set(user2Account, [
 user2EncryptKeys,
 user2EncryptKeys2,
 ]);
 });

 it(`Add new encrypt key for user1`, async () => {
 try {
 const result = await encFioSdk.genericAction('pushTransaction', {
 action: 'updcryptkey',
 account: 'fio.address',
 data: {
 fio_address: encTestFioAddressName,
 encrypt_public_key: user1EncryptKeys.publicKey,
 max_fee: 40000000000,
 tpid: '',
 },
 });
 expect(result.status).to.equal('OK');
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`requestFunds using encryptkey1 - user1 request of user2`, async () => {
 try {
 const result = await encFioSdk.genericAction('requestFunds', {
 payerFioAddress: encTestFioAddressName2,
 payeeFioAddress: encTestFioAddressName,
 payeeTokenPublicAddress: encFioSdk.publicKey,
 amount: fundsAmount,
 chainCode: fioChainCode,
 tokenCode: fioTokenCode,
 memo,
 maxFee: defaultFee,
 payerFioPublicKey: encFioSdk2.publicKey,
 technologyProviderId: '',
 encryptPrivateKey: user1EncryptKeys.privateKey,
 });

 requestIds.push(result.fio_request_id);
 expect(result.status).to.equal('requested');
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`Add new encrypt 2 key for user1`, async () => {
 try {
 const result = await encFioSdk.genericAction('pushTransaction', {
 action: 'updcryptkey',
 account: 'fio.address',
 data: {
 fio_address: encTestFioAddressName,
 encrypt_public_key: user1EncryptKeys2.publicKey,
 max_fee: 40000000000,
 tpid: '',
 },
 });
 expect(result.status).to.equal('OK');
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`requestFunds using encryptkey2 - user1 request of user2`, async () => {
 try {
 const result = await encFioSdk.genericAction('requestFunds', {
 payerFioAddress: encTestFioAddressName2,
 payeeFioAddress: encTestFioAddressName,
 payeeTokenPublicAddress: encFioSdk.publicKey,
 amount: fundsAmount,
 chainCode: fioChainCode,
 tokenCode: fioTokenCode,
 memo: memo2,
 maxFee: defaultFee,
 payerFioPublicKey: encFioSdk2.publicKey,
 technologyProviderId: '',
 encryptPrivateKey: user1EncryptKeys2.privateKey,
 });

 requestIds.push(result.fio_request_id);
 expect(result.status).to.equal('requested');
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`Add new encrypt key for user2`, async () => {
 try {
 const result = await encFioSdk2.genericAction('pushTransaction', {
 action: 'updcryptkey',
 account: 'fio.address',
 data: {
 fio_address: encTestFioAddressName2,
 encrypt_public_key: user2EncryptKeys.publicKey,
 max_fee: 40000000000,
 tpid: '',
 },
 });
 expect(result.status).to.equal('OK');
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`requestFunds using encryptkey - user2 request of user1`, async () => {
 try {
 const result = await encFioSdk2.genericAction('requestFunds', {
 payerFioAddress: encTestFioAddressName,
 payeeFioAddress: encTestFioAddressName2,
 payeeTokenPublicAddress: encFioSdk2.publicKey,
 amount: fundsAmount,
 chainCode: fioChainCode,
 tokenCode: fioTokenCode,
 memo: memo3,
 maxFee: defaultFee,
 payerFioPublicKey: encFioSdk.publicKey,
 technologyProviderId: '',
 encryptPrivateKey: user2EncryptKeys.privateKey,
 });

 requestIds2.push(result.fio_request_id);
 expect(result.status).to.equal('requested');
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`Add new encrypt2 key for user2`, async () => {
 try {
 const result = await encFioSdk2.genericAction('pushTransaction', {
 action: 'updcryptkey',
 account: 'fio.address',
 data: {
 fio_address: encTestFioAddressName2,
 encrypt_public_key: user2EncryptKeys2.publicKey,
 max_fee: 40000000000,
 tpid: '',
 },
 });
 expect(result.status).to.equal('OK');
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`requestFunds using encryptkey2 - user2 request of user1`, async () => {
 try {
 const result = await encFioSdk2.genericAction('requestFunds', {
 payerFioAddress: encTestFioAddressName,
 payeeFioAddress: encTestFioAddressName2,
 payeeTokenPublicAddress: encFioSdk2.publicKey,
 amount: fundsAmount,
 chainCode: fioChainCode,
 tokenCode: fioTokenCode,
 memo: memo4,
 maxFee: defaultFee,
 payerFioPublicKey: encFioSdk.publicKey,
 technologyProviderId: '',
 encryptPrivateKey: user2EncryptKeys2.privateKey,
 });
 requestIds2.push(result.fio_request_id);
 expect(result.status).to.equal('requested');
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`(sdk) Call getSentFioRequests user 1 encrypt keys`, async () => {
 try {
 const result = await encFioSdk.genericAction('getSentFioRequests', {
 encryptKeys: user1EncryptKeysMap,
 });

 expect(result).to.have.all.keys('requests', 'more');
 expect(result.requests).to.be.a('array');
 expect(result.more).to.be.a('number');

 const sentReq = result.requests.filter((sr) =>
 requestIds.includes(sr.fio_request_id)
 );

 const firstSentReq = sentReq[0];
 const secondSentReq = sentReq[1];

 expect(firstSentReq).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'status',
 'time_stamp',
 'content'
 );
 expect(firstSentReq.fio_request_id).to.be.a('number');
 expect(firstSentReq.fio_request_id).to.equal(requestIds[0]);
 expect(firstSentReq.payer_fio_address).to.be.a('string');
 expect(firstSentReq.payer_fio_address).to.equal(encTestFioAddressName2);
 expect(firstSentReq.payee_fio_address).to.be.a('string');
 expect(firstSentReq.payee_fio_address).to.equal(encTestFioAddressName);
 expect(firstSentReq.payer_fio_public_key).to.equal(encFioSdk2.publicKey);
 expect(firstSentReq.payee_fio_public_key).to.equal(
 user1EncryptKeys.publicKey
 );
 expect(firstSentReq.content.memo).to.be.equal(memo);

 expect(secondSentReq).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'status',
 'time_stamp',
 'content'
 );
 expect(secondSentReq.fio_request_id).to.be.a('number');
 expect(secondSentReq.fio_request_id).to.equal(requestIds[1]);
 expect(secondSentReq.payer_fio_address).to.be.a('string');
 expect(secondSentReq.payer_fio_address).to.equal(encTestFioAddressName2);
 expect(secondSentReq.payee_fio_address).to.be.a('string');
 expect(secondSentReq.payee_fio_address).to.equal(encTestFioAddressName);
 expect(secondSentReq.payer_fio_public_key).to.equal(encFioSdk2.publicKey);
 expect(secondSentReq.payee_fio_public_key).to.equal(
 user1EncryptKeys2.publicKey
 );
 expect(secondSentReq.content.memo).to.be.equal(memo2);
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`(sdk) Call getPendingFioRequests user2 encrypt keys`, async () => {
 try {
 const result = await encFioSdk2.genericAction('getPendingFioRequests', {
 encryptKeys: user2EncryptKeysMap,
 });

 expect(result).to.have.all.keys('requests', 'more');
 expect(result.requests).to.be.a('array');
 expect(result.more).to.be.a('number');

 const pendingReq = result.requests.filter((pr) =>
 requestIds.includes(pr.fio_request_id)
 );
 const firstPendingReq = pendingReq[0];
 const secondPendingReq = pendingReq[1];

 expect(firstPendingReq).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'time_stamp',
 'content'
 );
 expect(firstPendingReq.fio_request_id).to.be.a('number');
 expect(firstPendingReq.fio_request_id).to.equal(requestIds[0]);
 expect(firstPendingReq.payer_fio_address).to.be.a('string');
 expect(firstPendingReq.payer_fio_address).to.equal(
 encTestFioAddressName2
 );
 expect(firstPendingReq.payee_fio_address).to.be.a('string');
 expect(firstPendingReq.payee_fio_address).to.equal(encTestFioAddressName);
 expect(firstPendingReq.payer_fio_public_key).to.equal(
 encFioSdk2.publicKey
 );
 expect(firstPendingReq.payee_fio_public_key).to.equal(
 user1EncryptKeys.publicKey
 );
 expect(firstPendingReq.content.memo).to.equal(memo);

 expect(secondPendingReq).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'time_stamp',
 'content'
 );
 expect(secondPendingReq.fio_request_id).to.be.a('number');
 expect(secondPendingReq.fio_request_id).to.equal(requestIds[1]);
 expect(secondPendingReq.payer_fio_address).to.be.a('string');
 expect(secondPendingReq.payer_fio_address).to.equal(
 encTestFioAddressName2
 );
 expect(secondPendingReq.payee_fio_address).to.be.a('string');
 expect(secondPendingReq.payee_fio_address).to.equal(
 encTestFioAddressName
 );
 expect(secondPendingReq.payer_fio_public_key).to.equal(
 encFioSdk2.publicKey
 );
 expect(secondPendingReq.payee_fio_public_key).to.equal(
 user1EncryptKeys2.publicKey
 );
 expect(secondPendingReq.content.memo).to.equal(memo2);
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`(sdk) Call getSentFioRequests user2 encrypt keys`, async () => {
 try {
 const result = await encFioSdk2.genericAction('getSentFioRequests', {
 encryptKeys: user2EncryptKeysMap,
 });
 expect(result).to.have.all.keys('requests', 'more');
 expect(result.requests).to.be.a('array');
 expect(result.more).to.be.a('number');

 const sentReq = result.requests.filter((sr) =>
 requestIds2.includes(sr.fio_request_id)
 );
 const firstSentReq = sentReq[0];
 const secondSentReq = sentReq[1];

 expect(firstSentReq).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'status',
 'time_stamp',
 'content'
 );
 expect(firstSentReq.fio_request_id).to.be.a('number');
 expect(firstSentReq.fio_request_id).to.equal(requestIds2[0]);
 expect(firstSentReq.payer_fio_address).to.be.a('string');
 expect(firstSentReq.payer_fio_address).to.equal(encTestFioAddressName);
 expect(firstSentReq.payee_fio_address).to.be.a('string');
 expect(firstSentReq.payee_fio_address).to.equal(encTestFioAddressName2);
 expect(firstSentReq.payer_fio_public_key).to.equal(
 user1EncryptKeys2.publicKey
 );
 expect(firstSentReq.payee_fio_public_key).to.equal(
 user2EncryptKeys.publicKey
 );
 expect(firstSentReq.content.memo).to.be.equal(memo3);

 expect(secondSentReq).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'status',
 'time_stamp',
 'content'
 );
 expect(secondSentReq.fio_request_id).to.be.a('number');
 expect(secondSentReq.fio_request_id).to.equal(requestIds2[1]);
 expect(secondSentReq.payer_fio_address).to.be.a('string');
 expect(secondSentReq.payer_fio_address).to.equal(encTestFioAddressName);
 expect(secondSentReq.payee_fio_address).to.be.a('string');
 expect(secondSentReq.payee_fio_address).to.equal(encTestFioAddressName2);
 expect(secondSentReq.payer_fio_public_key).to.equal(
 user1EncryptKeys2.publicKey
 );
 expect(secondSentReq.payee_fio_public_key).to.equal(
 user2EncryptKeys2.publicKey
 );
 expect(secondSentReq.content.memo).to.be.equal(memo4);
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`(sdk) Call getPendingFioRequests user1 encrypt keys`, async () => {
 try {
 const result = await encFioSdk.genericAction('getPendingFioRequests', {
 encryptKeys: user1EncryptKeysMap,
 });
 expect(result).to.have.all.keys('requests', 'more');
 expect(result.requests).to.be.a('array');
 expect(result.more).to.be.a('number');

 const pendingReq = result.requests.filter((pr) =>
 requestIds2.includes(pr.fio_request_id)
 );
 const firstPendingReq = pendingReq[0];
 const secondPendingReq = pendingReq[1];

 expect(firstPendingReq).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'time_stamp',
 'content'
 );
 expect(firstPendingReq.fio_request_id).to.be.a('number');
 expect(firstPendingReq.fio_request_id).to.equal(requestIds2[0]);
 expect(firstPendingReq.payer_fio_address).to.be.a('string');
 expect(firstPendingReq.payer_fio_address).to.equal(encTestFioAddressName);
 expect(firstPendingReq.payee_fio_address).to.be.a('string');
 expect(firstPendingReq.payee_fio_address).to.equal(
 encTestFioAddressName2
 );
 expect(firstPendingReq.payer_fio_public_key).to.equal(
 user1EncryptKeys2.publicKey
 );
 expect(firstPendingReq.payee_fio_public_key).to.equal(
 user2EncryptKeys.publicKey
 );
 expect(firstPendingReq.content.memo).to.equal(memo3);

 expect(secondPendingReq).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'time_stamp',
 'content'
 );
 expect(secondPendingReq.fio_request_id).to.be.a('number');
 expect(secondPendingReq.fio_request_id).to.equal(requestIds2[1]);
 expect(secondPendingReq.payer_fio_address).to.be.a('string');
 expect(secondPendingReq.payer_fio_address).to.equal(
 encTestFioAddressName
 );
 expect(secondPendingReq.payee_fio_address).to.be.a('string');
 expect(secondPendingReq.payee_fio_address).to.equal(
 encTestFioAddressName2
 );
 expect(secondPendingReq.payer_fio_public_key).to.equal(
 user1EncryptKeys2.publicKey
 );
 expect(secondPendingReq.payee_fio_public_key).to.equal(
 user2EncryptKeys2.publicKey
 );
 expect(secondPendingReq.content.memo).to.equal(memo4);
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`(sdk) Call getReceivedFioRequests encrypt keys - user1 to user2`, async () => {
 try {
 const result = await encFioSdk.genericAction('getReceivedFioRequests', {
 encryptKeys: user1EncryptKeysMap,
 });
 expect(result).to.have.all.keys('requests', 'more');
 expect(result.requests).to.be.a('array');
 expect(result.more).to.be.a('number');

 const receivedReq = result.requests.filter((pr) =>
 requestIds2.includes(pr.fio_request_id)
 );
 const firstReceivedReq = receivedReq[0];
 const secondReceivedReq = receivedReq[1];

 expect(firstReceivedReq).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'time_stamp',
 'content',
 'status'
 );
 expect(firstReceivedReq.status).to.be.a('string');
 expect(firstReceivedReq.fio_request_id).to.be.a('number');
 expect(firstReceivedReq.fio_request_id).to.equal(requestIds2[0]);
 expect(firstReceivedReq.payer_fio_address).to.be.a('string');
 expect(firstReceivedReq.payer_fio_address).to.equal(
 encTestFioAddressName
 );
 expect(firstReceivedReq.payee_fio_address).to.be.a('string');
 expect(firstReceivedReq.payee_fio_address).to.equal(
 encTestFioAddressName2
 );
 expect(firstReceivedReq.payer_fio_public_key).to.equal(
 user1EncryptKeys2.publicKey
 );
 expect(firstReceivedReq.payee_fio_public_key).to.equal(
 user2EncryptKeys.publicKey
 );
 expect(firstReceivedReq.content.memo).to.equal(memo3);

 expect(secondReceivedReq).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'time_stamp',
 'content',
 'status'
 );
 expect(secondReceivedReq.status).to.be.a('string');
 expect(secondReceivedReq.fio_request_id).to.be.a('number');
 expect(secondReceivedReq.fio_request_id).to.equal(requestIds2[1]);
 expect(secondReceivedReq.payer_fio_address).to.be.a('string');
 expect(secondReceivedReq.payer_fio_address).to.equal(
 encTestFioAddressName
 );
 expect(secondReceivedReq.payee_fio_address).to.be.a('string');
 expect(secondReceivedReq.payee_fio_address).to.equal(
 encTestFioAddressName2
 );
 expect(secondReceivedReq.payer_fio_public_key).to.equal(
 user1EncryptKeys2.publicKey
 );
 expect(secondReceivedReq.payee_fio_public_key).to.equal(
 user2EncryptKeys2.publicKey
 );
 expect(secondReceivedReq.content.memo).to.equal(memo4);
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`(sdk) Call getReceivedFioRequests encrypt keys - user2 to user1`, async () => {
 try {
 const result = await encFioSdk2.genericAction('getReceivedFioRequests', {
 encryptKeys: user2EncryptKeysMap,
 });
 expect(result).to.have.all.keys('requests', 'more');
 expect(result.requests).to.be.a('array');
 expect(result.more).to.be.a('number');

 const receivedReq = result.requests.filter((pr) =>
 requestIds.includes(pr.fio_request_id)
 );
 const firstReceivedReq = receivedReq[0];
 const secondReceivedReq = receivedReq[1];

 expect(firstReceivedReq).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'time_stamp',
 'content',
 'status'
 );
 expect(firstReceivedReq.status).to.be.a('string');
 expect(firstReceivedReq.fio_request_id).to.be.a('number');
 expect(firstReceivedReq.fio_request_id).to.equal(requestIds[0]);
 expect(firstReceivedReq.payer_fio_address).to.be.a('string');
 expect(firstReceivedReq.payer_fio_address).to.equal(
 encTestFioAddressName2
 );
 expect(firstReceivedReq.payee_fio_address).to.be.a('string');
 expect(firstReceivedReq.payee_fio_address).to.equal(
 encTestFioAddressName
 );
 expect(firstReceivedReq.payer_fio_public_key).to.equal(
 encFioSdk2.publicKey
 );
 expect(firstReceivedReq.payee_fio_public_key).to.equal(
 user1EncryptKeys.publicKey
 );
 expect(firstReceivedReq.content.memo).to.equal(memo);

 expect(secondReceivedReq).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'time_stamp',
 'content',
 'status'
 );
 expect(secondReceivedReq.status).to.be.a('string');
 expect(secondReceivedReq.fio_request_id).to.be.a('number');
 expect(secondReceivedReq.fio_request_id).to.equal(requestIds[1]);
 expect(secondReceivedReq.payer_fio_address).to.be.a('string');
 expect(secondReceivedReq.payer_fio_address).to.equal(
 encTestFioAddressName2
 );
 expect(secondReceivedReq.payee_fio_address).to.be.a('string');
 expect(secondReceivedReq.payee_fio_address).to.equal(
 encTestFioAddressName
 );
 expect(secondReceivedReq.payer_fio_public_key).to.equal(
 encFioSdk2.publicKey
 );
 expect(secondReceivedReq.payee_fio_public_key).to.equal(
 user1EncryptKeys2.publicKey
 );
 expect(secondReceivedReq.content.memo).to.equal(memo2);
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`Cancel request encrypt key - user1 to user2`, async () => {
 try {
 const result = await encFioSdk.genericAction('cancelFundsRequest', {
 fioRequestId: requestIds[0],
 maxFee: defaultFee,
 tpid: '',
 });
 expect(result).to.have.all.keys(
 'transaction_id',
 'block_num',
 'block_time',
 'status',
 'fee_collected'
 );
 expect(result.status).to.be.a('string');
 expect(result.fee_collected).to.be.a('number');
 expect(result.block_num).to.be.a('number');
 expect(result.transaction_id).to.be.a('string');
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`Cancel request encrypt key - user2 to user1`, async () => {
 try {
 const result = await encFioSdk2.genericAction('cancelFundsRequest', {
 fioRequestId: requestIds2[0],
 maxFee: defaultFee,
 tpid: '',
 });
 expect(result).to.have.all.keys(
 'transaction_id',
 'block_num',
 'block_time',
 'status',
 'fee_collected'
 );
 expect(result.status).to.be.a('string');
 expect(result.fee_collected).to.be.a('number');
 expect(result.block_num).to.be.a('number');
 expect(result.transaction_id).to.be.a('string');
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`(sdk) Call getCancelledFioRequests user1 encrypt keys`, async () => {
 try {
 await timeout(4000);
 const result = await encFioSdk.genericAction('getCancelledFioRequests', {
 encryptKeys: user1EncryptKeysMap,
 });
 expect(result).to.have.all.keys('requests', 'more');
 expect(result.requests).to.be.a('array');
 expect(result.more).to.be.a('number');

 const canceledReq = result.requests.find(
 (cr) => requestIds[0] === cr.fio_request_id
 );

 expect(canceledReq).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'status',
 'time_stamp',
 'content'
 );
 expect(canceledReq.fio_request_id).to.be.a('number');
 expect(canceledReq.fio_request_id).to.equal(requestIds[0]);
 expect(canceledReq.payer_fio_address).to.be.a('string');
 expect(canceledReq.payer_fio_address).to.equal(encTestFioAddressName2);
 expect(canceledReq.payee_fio_address).to.be.a('string');
 expect(canceledReq.payee_fio_address).to.equal(encTestFioAddressName);
 expect(canceledReq.payer_fio_public_key).to.equal(encFioSdk2.publicKey);
 expect(canceledReq.payee_fio_public_key).to.equal(
 user1EncryptKeys.publicKey
 );
 expect(canceledReq.content.memo).to.be.equal(memo);
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`(sdk) Call getCancelledFioRequests user2 encrypt keys`, async () => {
 try {
 const result = await encFioSdk2.genericAction('getCancelledFioRequests', {
 encryptKeys: user2EncryptKeysMap,
 });
 expect(result).to.have.all.keys('requests', 'more');
 expect(result.requests).to.be.a('array');
 expect(result.more).to.be.a('number');

 const canceledReq = result.requests.find(
 (cr) => requestIds2[0] === cr.fio_request_id
 );

 expect(canceledReq).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'status',
 'time_stamp',
 'content'
 );
 expect(canceledReq.fio_request_id).to.be.a('number');
 expect(canceledReq.fio_request_id).to.equal(requestIds2[0]);
 expect(canceledReq.payer_fio_address).to.be.a('string');
 expect(canceledReq.payer_fio_address).to.equal(encTestFioAddressName);
 expect(canceledReq.payee_fio_address).to.be.a('string');
 expect(canceledReq.payee_fio_address).to.equal(encTestFioAddressName2);
 expect(canceledReq.payer_fio_public_key).to.equal(
 user1EncryptKeys2.publicKey
 );
 expect(canceledReq.payee_fio_public_key).to.equal(
 user2EncryptKeys.publicKey
 );
 expect(canceledReq.content.memo).to.be.equal(memo3);
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`recordObtData encrypt2 key - user1 to user2`, async () => {
 try {
 const transfer = await encFioSdk.genericAction('transferTokens', {
 payeeFioPublicKey: encFioSdk2.publicKey,
 amount: fundsAmount,
 maxFee: defaultFee,
 });
 const result = await encFioSdk.genericAction('recordObtData', {
 memo: memo4,
 fioRequestId: requestIds2[1],
 payerFioAddress: encTestFioAddressName,
 payeeFioAddress: encTestFioAddressName2,
 payerTokenPublicAddress: encPublicKey,
 payeeTokenPublicAddress: encPublicKey2,
 amount: fundsAmount,
 chainCode: fioChainCode,
 tokenCode: fioTokenCode,
 status: 'sent_to_blockchain',
 obtId: transfer.transaction_id,
 maxFee: defaultFee,
 encryptPrivateKey: user1EncryptKeys2.privateKey,
 });
 expect(result).to.have.all.keys(
 'transaction_id',
 'block_num',
 'block_time',
 'status',
 'fee_collected'
 );
 expect(result.status).to.be.a('string');
 expect(result.fee_collected).to.be.a('number');
 expect(result.block_num).to.be.a('number');
 expect(result.transaction_id).to.be.a('string');
 } catch (err) {
 console.log('RecordObtData Error', err);
 expect(err).to.equal(null);
 }
 });

 it(`recordObtData encrypt2 key - user2 to user1`, async () => {
 const transfer = await encFioSdk2.genericAction('transferTokens', {
 payeeFioPublicKey: encFioSdk.publicKey,
 amount: fundsAmount,
 maxFee: defaultFee,
 });
 const result = await encFioSdk2.genericAction('recordObtData', {
 fioRequestId: requestIds[1],
 payerFioAddress: encTestFioAddressName2,
 payeeFioAddress: encTestFioAddressName,
 payerTokenPublicAddress: encFioSdk2.publicKey,
 payeeTokenPublicAddress: encFioSdk.publicKey,
 amount: fundsAmount,
 chainCode: fioChainCode,
 tokenCode: fioTokenCode,
 status: 'sent_to_blockchain',
 obtId: transfer.transaction_id,
 memo: memo2,
 maxFee: defaultFee,
 encryptPrivateKey: user2EncryptKeys2.privateKey,
 });
 expect(result).to.have.all.keys(
 'transaction_id',
 'block_num',
 'block_time',
 'status',
 'fee_collected'
 );
 expect(result.status).to.be.a('string');
 expect(result.fee_collected).to.be.a('number');
 expect(result.block_num).to.be.a('number');
 expect(result.transaction_id).to.be.a('string');
 });

 it(`(sdk) Call getObtData - Payer user1`, async () => {
 try {
 await timeout(10000);
 const result = await encFioSdk.genericAction('getObtData', {
 encryptKeys: user1EncryptKeysMap,
 });
 expect(result).to.have.all.keys('obt_data_records', 'more');
 expect(result.obt_data_records).to.be.a('array');
 expect(result.more).to.be.a('number');

 const obtData = result.obt_data_records.find(
 (pr) => parseInt(pr.fio_request_id) === parseInt(requestIds2[1])
 );

 expect(obtData).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'status',
 'time_stamp',
 'content'
 );
 expect(obtData.fio_request_id).to.be.a('number');
 expect(obtData.fio_request_id).to.equal(requestIds2[1]);
 expect(obtData.payer_fio_address).to.be.a('string');
 expect(obtData.payer_fio_address).to.equal(encTestFioAddressName);
 expect(obtData.payee_fio_address).to.be.a('string');
 expect(obtData.payee_fio_address).to.equal(encTestFioAddressName2);
 expect(obtData.payer_fio_public_key).to.equal(
 user1EncryptKeys2.publicKey
 );
 expect(obtData.payee_fio_public_key).to.equal(
 user2EncryptKeys2.publicKey
 );
 expect(obtData.content.memo).to.be.equal(memo4);
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`(sdk) Call getObtData - Payee user2`, async () => {
 try {
 const result = await encFioSdk2.genericAction('getObtData', {
 encryptKeys: user2EncryptKeysMap,
 });

 expect(result).to.have.all.keys('obt_data_records', 'more');
 expect(result.obt_data_records).to.be.a('array');
 expect(result.more).to.be.a('number');

 const obtData = result.obt_data_records.find(
 (pr) => parseInt(pr.fio_request_id) === parseInt(requestIds2[1])
 );

 expect(obtData).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'status',
 'time_stamp',
 'content'
 );
 expect(obtData.fio_request_id).to.be.a('number');
 expect(obtData.fio_request_id).to.equal(requestIds2[1]);
 expect(obtData.payer_fio_address).to.be.a('string');
 expect(obtData.payer_fio_address).to.equal(encTestFioAddressName);
 expect(obtData.payee_fio_address).to.be.a('string');
 expect(obtData.payee_fio_address).to.equal(encTestFioAddressName2);
 expect(obtData.payer_fio_public_key).to.equal(
 user1EncryptKeys2.publicKey
 );
 expect(obtData.payee_fio_public_key).to.equal(
 user2EncryptKeys2.publicKey
 );
 expect(obtData.content.memo).to.be.equal(memo4);
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`(sdk) Call getObtData - Payer user2`, async () => {
 try {
 await timeout(10000);
 const result = await encFioSdk2.genericAction('getObtData', {
 encryptKeys: user2EncryptKeysMap,
 });
 expect(result).to.have.all.keys('obt_data_records', 'more');
 expect(result.obt_data_records).to.be.a('array');
 expect(result.more).to.be.a('number');

 const obtData = result.obt_data_records.find(
 (pr) => parseInt(pr.fio_request_id) === parseInt(requestIds[1])
 );

 expect(obtData).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'status',
 'time_stamp',
 'content'
 );
 expect(obtData.fio_request_id).to.be.a('number');
 expect(obtData.fio_request_id).to.equal(requestIds[1]);
 expect(obtData.payer_fio_address).to.be.a('string');
 expect(obtData.payer_fio_address).to.equal(encTestFioAddressName2);
 expect(obtData.payee_fio_address).to.be.a('string');
 expect(obtData.payee_fio_address).to.equal(encTestFioAddressName);
 expect(obtData.payer_fio_public_key).to.equal(encPublicKey2);
 expect(obtData.payee_fio_public_key).to.equal(
 user1EncryptKeys2.publicKey
 );
 expect(obtData.content.memo).to.be.equal(memo2);
 } catch (err) {
 expect(err).to.equal(null);
 }
 });

 it(`(sdk) Call getObtData - Payee user1`, async () => {
 try {
 const result = await encFioSdk.genericAction('getObtData', {
 encryptKeys: user1EncryptKeysMap,
 });

 expect(result).to.have.all.keys('obt_data_records', 'more');
 expect(result.obt_data_records).to.be.a('array');
 expect(result.more).to.be.a('number');

 const obtData = result.obt_data_records.find(
 (pr) => parseInt(pr.fio_request_id) === parseInt(requestIds[1])
 );

 expect(obtData).to.have.all.keys(
 'fio_request_id',
 'payer_fio_address',
 'payee_fio_address',
 'payee_fio_public_key',
 'payer_fio_public_key',
 'status',
 'time_stamp',
 'content'
 );
 expect(obtData.fio_request_id).to.be.a('number');
 expect(obtData.fio_request_id).to.equal(requestIds[1]);
 expect(obtData.payer_fio_address).to.be.a('string');
 expect(obtData.payer_fio_address).to.equal(encTestFioAddressName2);
 expect(obtData.payee_fio_address).to.be.a('string');
 expect(obtData.payee_fio_address).to.equal(encTestFioAddressName);
 expect(obtData.payer_fio_public_key).to.equal(encPublicKey2);
 expect(obtData.payee_fio_public_key).to.equal(
 user1EncryptKeys2.publicKey
 );
 expect(obtData.content.memo).to.be.equal(memo2);
 } catch (err) {
 expect(err).to.equal(null);
 }
 });
 });
 */

describe('Request funds, cancel funds request', () => {
    const fundsAmount = 3
    let requestId: number
    const memo = 'testing fund request'

    it(`requestFunds`, async () => {
        const result = await fioSdk2.genericAction('requestFunds', {
            amount: fundsAmount,
            chainCode: fioChainCode,
            maxFee: defaultFee,
            memo,
            payeeFioAddress: testFioAddressName2,
            payeeTokenPublicAddress: testFioAddressName2,
            payerFioAddress: testFioAddressName,
            tokenCode: fioTokenCode,
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

    it(`getCancelledFioRequests`, async () => {
        try {
            await timeout(4000)
            const result = await fioSdk2.genericAction('getCancelledFioRequests', {})
            expect(result).to.have.all.keys('requests', 'more')
            expect(result.requests).to.be.a('array')
            expect(result.more).to.be.a('number')
            const pendingReq = result.requests.find((pr) => pr.fio_request_id === requestId)!
            expect(pendingReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'time_stamp', 'content', 'status')
            expect(pendingReq.fio_request_id).to.be.a('number')
            expect(pendingReq.fio_request_id).to.equal(requestId)
            expect(pendingReq.payer_fio_address).to.be.a('string')
            expect(pendingReq.payer_fio_address).to.equal(testFioAddressName)
            expect(pendingReq.payee_fio_address).to.be.a('string')
            expect(pendingReq.payee_fio_address).to.equal(testFioAddressName2)
            expect(pendingReq.content.memo).to.be.equal(memo)
        } catch (e) {
            console.log(e)
        }
    })

})

describe('Request funds, reject', () => {
    const fundsAmount = 4
    let requestId: number
    const memo = 'testing fund request'

    it(`requestFunds`, async () => {
        const result = await fioSdk2.genericAction('requestFunds', {
            amount: fundsAmount,
            chainCode: fioChainCode,
            maxFee: defaultFee,
            memo,
            payeeFioAddress: testFioAddressName2,
            payeeTokenPublicAddress: testFioAddressName2,
            payerFioAddress: testFioAddressName,
            tokenCode: fioTokenCode,
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
        const pendingReq = result.requests.find((pr) => pr.fio_request_id === requestId)!
        expect(pendingReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'time_stamp', 'content')
        expect(pendingReq.fio_request_id).to.be.a('number')
        expect(pendingReq.fio_request_id).to.equal(requestId)
        expect(pendingReq.payer_fio_address).to.be.a('string')
        expect(pendingReq.payer_fio_address).to.equal(testFioAddressName)
        expect(pendingReq.payee_fio_address).to.be.a('string')
        expect(pendingReq.payee_fio_address).to.equal(testFioAddressName2)
        expect(pendingReq.content.memo).to.be.equal(memo)
    })

    it(`getFee for rejectFundsRequest`, async () => {
        const result = await fioSdk.genericAction('getFeeForRejectFundsRequest', {
            payerFioAddress: testFioAddressName2,
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
})

describe('Record obt data, check', () => {
    const obtId = generateObtId()
    const fundsAmount = 4.5

    it(`getFee for recordObtData`, async () => {
        const result = await fioSdk.genericAction('getFeeForRecordObtData', {
            payerFioAddress: testFioAddressName,
        })

        expect(result).to.have.all.keys('fee')
        expect(result.fee).to.be.a('number')
    })

    it(`recordObtData`, async () => {
        const result = await fioSdk.genericAction('recordObtData', {
            amount: fundsAmount,
            chainCode: fioChainCode,
            maxFee: defaultFee,
            obtId,
            payeeFioAddress: testFioAddressName2,
            payeeTokenPublicAddress: publicKey2,
            payerFioAddress: testFioAddressName,
            payerTokenPublicAddress: publicKey,
            status: 'sent_to_blockchain',
            tokenCode: fioTokenCode,
        })
        expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
        expect(result.status).to.be.a('string')
        expect(result.fee_collected).to.be.a('number')
        expect(result.block_num).to.be.a('number')
        expect(result.transaction_id).to.be.a('string')
    })

    it(`Payer getObtData`, async () => {
        await timeout(4000)
        const result = await fioSdk.genericAction('getObtData', {tokenCode: fioTokenCode})
        expect(result).to.have.all.keys('obt_data_records', 'more')
        expect(result.obt_data_records).to.be.a('array')
        expect(result.more).to.be.a('number')
        const obtData = (result.obt_data_records as FioSentItem[]).find((pr) => pr.content.obt_id === obtId)!
        expect(obtData).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'status', 'time_stamp', 'content')
        expect(obtData.content.obt_id).to.be.a('string')
        expect(obtData.content.obt_id).to.equal(obtId)
        expect(obtData.payer_fio_address).to.be.a('string')
        expect(obtData.payer_fio_address).to.equal(testFioAddressName)
        expect(obtData.payee_fio_address).to.be.a('string')
        expect(obtData.payee_fio_address).to.equal(testFioAddressName2)
    })

    it(`Payee getObtData`, async () => {
        const result = await fioSdk2.genericAction('getObtData', {tokenCode: fioTokenCode})
        expect(result).to.have.all.keys('obt_data_records', 'more')
        expect(result.obt_data_records).to.be.a('array')
        expect(result.more).to.be.a('number')
        const obtData = (result.obt_data_records as FioSentItem[]).find((pr) => pr.content.obt_id === obtId)!
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
            NEW_FUNDS_CONTENT,
            content,
            bobPrivateKey,
            alicePublicKey,
        )
        expect(cipherContent).to.be.a('string')

        const uncipherContent = fioSDKBob.transactions.getUnCipherContent(
            NEW_FUNDS_CONTENT,
            cipherContent,
            alicePrivateKey,
            bobPublicKey,
        )
        expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

        // same party, ensure cannot decipher
        try {
            const uncipherContentSameParty = fioSDKBob.transactions.getUnCipherContent(
                NEW_FUNDS_CONTENT,
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
                NEW_FUNDS_CONTENT,
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
                NEW_FUNDS_CONTENT,
                cipherContent,
                bobPrivateKey,
                nonPartyPublicKey,
            )
            expect(uncipherContentNonPartyA.payee_public_address).to.not.equal(bobPublicKey)
        } catch (e) {
            // empty
        }

    })

    it(`Decrypt from iOS SDK - Request New Funds`, async () => {
        const cipherContent = 'iNz623p8SjbFG3rNbxLeVzQhs7n4aB8UGHvkF08HhBXD3X9g6bVFJl93j/OqYdkiycxShF64uc9OHFc/qbOeeS8+WVL2YRpd9JaRqdTUE9XKFPZ6lETQ7MTbGT+qppMoJ0tWCP6mWL4M9V1xu6lE3lJkuRS4kXnwtOUJOcBDG7ddFyHaV1LnLY/jnOJHJhm8'
        expect(cipherContent).to.be.a('string')

        const uncipherContent = fioSDKBob.transactions.getUnCipherContent(
            NEW_FUNDS_CONTENT,
            cipherContent,
            alicePrivateKey,
            bobPublicKey,
        )
        expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

        const uncipherContentA = fioSDKBob.transactions.getUnCipherContent(
            NEW_FUNDS_CONTENT,
            cipherContent,
            bobPrivateKey,
            alicePublicKey,
        )
        expect(uncipherContentA.payee_public_address).to.equal(bobPublicKey)

    })

    it(`Decrypt from Kotlin SDK - Request New Funds`, async () => {
        const cipherContent = 'PUEe6pA4HAl7EHA1XFRqJPMjrugD0ZT09CDx4/rH3ktwqo+WaoZRIuqXR4Xvr6ki1XPp7KwwSy6GqPUuBRuBS8Z8c0/xGgcDXQHJuYSsaV3d9Q61W1JeCDvsSIOdd3MTzObNJNcMj3gad+vPcOvJ7BojeufUoe0HQvxjXO+Gpp20UPdQnljLVsir+XuFmreZwMLWfggIovd0A9t438o+DA=='
        expect(cipherContent).to.be.a('string')

        const uncipherContent = fioSDKBob.transactions.getUnCipherContent(
            NEW_FUNDS_CONTENT,
            cipherContent,
            alicePrivateKey,
            bobPublicKey,
        )
        expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

        const uncipherContentA = fioSDKBob.transactions.getUnCipherContent(
            NEW_FUNDS_CONTENT,
            cipherContent,
            bobPrivateKey,
            alicePublicKey,
        )
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
            RECORD_OBT_DATA_CONTENT,
            content,
            bobPrivateKey,
            alicePublicKey,
        )
        expect(cipherContent).to.be.a('string')

        const uncipherContent = fioSDKBob.transactions.getUnCipherContent(
            RECORD_OBT_DATA_CONTENT,
            cipherContent,
            alicePrivateKey,
            bobPublicKey,
        )
        expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

        // same party, ensure cannot decipher
        try {
            const uncipherContentSameParty = fioSDKBob.transactions.getUnCipherContent(
                RECORD_OBT_DATA_CONTENT,
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
                RECORD_OBT_DATA_CONTENT,
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
                RECORD_OBT_DATA_CONTENT,
                cipherContent,
                bobPrivateKey,
                nonPartyPublicKey,
            )
            expect(uncipherContentNonPartyA.payee_public_address).to.not.equal(bobPublicKey)
        } catch (e) {
            // empty
        }

    })

    it(`Decrypt from iOS SDK - RecordObtData`, async () => {
        const cipherContent = 'XJqqkHspW0zp+dHKj9TZMn5mZzdMQrdIAXNOlKPekeEpbjyeh92hO+lB9gA6wnNuq8YNLcGA1s0NPGzb+DlHzXT2tCulgk5fiQy6+8AbThPzB0N6xICmVV3Ontib8FVlTrVrqg053PK9JeHUsg0Sb+vG/dz9+ovcSDHaByxybRNhZOVBe8jlg91eakaU1H8XKDxYOtI3+jYESK02g2Rw5Ya9ec+/PnEBQ6DjkHruKDorEF1D+nDT/0CK46VsfdYzYK8IV0T9Nal4H6Bf4wrMlQ=='
        expect(cipherContent).to.be.a('string')

        const uncipherContent = fioSDKBob.transactions.getUnCipherContent(
            RECORD_OBT_DATA_CONTENT,
            cipherContent,
            alicePrivateKey,
            bobPublicKey,
        )
        expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

        const uncipherContentA = fioSDKBob.transactions.getUnCipherContent(
            RECORD_OBT_DATA_CONTENT,
            cipherContent,
            bobPrivateKey,
            alicePublicKey,
        )
        expect(uncipherContentA.payee_public_address).to.equal(bobPublicKey)

    })

    it(`Decrypt from Kotlin SDK - RecordObtData`, async () => {
        const cipherContent = '4IVNiV3Vg0/ZwkBywOWjSgER/aBzHypmfYoljA7y3Qf04mI/IkwPwO9+yj7EISTdRb2LEPgEDg1RsWBdAFmm6AE9ZXG1W5qPrtFNZuZw3qhCJbisnTLCPA2pEcAGKxBhhTaIx74/+OLXTNq5Z7RWWB+OUIa3bBJLHyhO79BUQ9dIsfiDVGmlRL5yq57uqRfb8FWoQraK31As/OFJ5Gj7KEYehzviJnMX7pYhE4CJkkfYYGfB4AHmHllFSMaLCrkY8BvDViQZTuniqDOua6Po51muyCaJLF5rdMSS0Za5F9U='
        expect(cipherContent).to.be.a('string')

        const uncipherContent = fioSDKBob.transactions.getUnCipherContent(
            RECORD_OBT_DATA_CONTENT,
            cipherContent,
            alicePrivateKey,
            bobPublicKey,
        )
        expect(uncipherContent.payee_public_address).to.equal(bobPublicKey)

        const uncipherContentA = fioSDKBob.transactions.getUnCipherContent(
            RECORD_OBT_DATA_CONTENT,
            cipherContent,
            bobPrivateKey,
            alicePublicKey,
        )
        expect(uncipherContentA.payee_public_address).to.equal(bobPublicKey)

    })

})

describe('Check prepared transaction', () => {
    it(`requestFunds prepared transaction`, async () => {
        fioSdk2.setSignedTrxReturnOption(true)
        const preparedTrx = await fioSdk2.genericAction('requestFunds', {
            amount: 200000,
            chainCode: fioChainCode,
            maxFee: defaultFee,
            memo: 'prepared transaction',
            payeeFioAddress: testFioAddressName2,
            payeeTokenPublicAddress: testFioAddressName2,
            payerFioAddress: testFioAddressName,
            tokenCode: fioTokenCode,
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
