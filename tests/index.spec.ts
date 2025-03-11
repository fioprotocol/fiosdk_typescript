/* tslint:disable:no-console */
import * as dotenv from 'dotenv'
import 'mocha'
import nodeFetch from 'node-fetch'
import {
    FIOSDK,
} from '../src/FIOSDK'

import { RawAbiTests } from './common/raw-abi.spec'
import { WrongRequestsTests } from './common/wrong-requests.spec'
import { GenericActionsTests } from './common/generic-actions.spec'
import { AccountPermissionsTests } from './common/account-permissions.spec'
import { FioPermissionsTests } from './common/fio-permissions.spec'
import { VoteBlockProducerTests } from './common/vote-blockproducer.spec'
import { StakeTokensTests } from './common/stake-tokens.spec'
import { NftsTests } from './common/nfts.spec'
import { FioRequestApproveAndPayFundsTests } from './common/fio-request-approve-pay-funds.spec'
import { FioRequestCancelTests } from './common/fio-request-cancel.spec'
import { FioRequestRejectTests } from './common/fio-request-reject.spec'
import { TransferTokensTests } from './common/transfer-tokens.spec'
import { RecordObtDataTests } from './common/record-obt-data.spec'

import { defaultFee } from './constants'
import { generateTestingFioAddress, generateTestingFioDomain, mnemonic, mnemonic2, timeout } from './utils'
import { CheckTransactionTests } from './common/check-transaction.spec'
import { EncryptDecryptContentTests } from './common/encrypt-decrypt-content.spec'
import { FioRequestsWithDifferentEncryptKeysTests } from './common/fio-requests-with-different-encrypt-keys.spec'

dotenv.config({path: ['.env.test', '.env']})

const fetchJson = async (uri: string, opts = {}) => {
    return nodeFetch(uri, opts)
}

let privateKey
let publicKey

let privateKey2
let publicKey2

let testFioAddressName
let testFioAddressName2
let testFioDomainName

const faucetPub = process.env.LOCAL_FAUCET_PUBLIC_KEY as string
const faucetPriv = process.env.LOCAL_FAUCET_PRIVATE_KEY as string

let fioSdk: FIOSDK
let fioSdk2: FIOSDK
let fioSdkWithWrongBaseUrl: FIOSDK

/**
 * Url for local dev node
 */
const baseUrls = ['http://localhost:8889/v1/'] // e.g., ['http://localhost:8889/v1/']

/**
 * Keys to transfer funds to be able make all calls with fee
 */
/*

FAUCET_PRIV_KEY: '5KF2B21xT5pE5G3LNA6LKJc6AP2pAd2EnfpAUrJH12SFV8NtvCD',
FAUCET_PUB_KEY: 'FIO6zwqqzHQcqCc2MB4jpp1F73MXpisEQe2SDghQFSGQKoAPjvQ3H',
FAUCET_ACCOUNT: 'qhh25sqpktwh',
*/

const proxyTpId = 'bp1@dapixdev'
const receiveTransferTimout = 5000

before(async () => {
    let privateKeyRes = await FIOSDK.createPrivateKeyMnemonic(mnemonic)
    privateKey = privateKeyRes.fioKey
    let publicKeyRes = FIOSDK.derivedPublicKey(privateKey)
    publicKey = publicKeyRes.publicKey
    fioSdk = new FIOSDK({
        privateKey,
        publicKey,
        apiUrls: baseUrls,
        fetchJson,
    })
    const testDomain = generateTestingFioDomain()
    testFioAddressName = generateTestingFioAddress(testDomain)
    testFioDomainName = testDomain

    await timeout(1000)
    privateKeyRes = await FIOSDK.createPrivateKeyMnemonic(mnemonic2)
    privateKey2 = privateKeyRes.fioKey
    publicKeyRes = FIOSDK.derivedPublicKey(privateKey2)
    publicKey2 = publicKeyRes.publicKey
    fioSdk2 = new FIOSDK({
        privateKey: privateKey2,
        publicKey: publicKey2,
        apiUrls: baseUrls,
        fetchJson,
    })

    fioSdkWithWrongBaseUrl = new FIOSDK({
        privateKey: privateKey2,
        publicKey: publicKey2,
        apiUrls: baseUrls,
        fetchJson,
    })

    const testDomain2 = generateTestingFioDomain()
    await timeout(1000)
    testFioAddressName2 = generateTestingFioAddress(testDomain2)

    const fioSdkFaucet = new FIOSDK({
        privateKey: faucetPriv,
        publicKey: faucetPub,
        apiUrls: baseUrls,
        fetchJson,
    })

    await fioSdkFaucet.transferTokens({
        payeeFioPublicKey: publicKey,
        amount: defaultFee * 4,
        maxFee: defaultFee,
    })
    await fioSdkFaucet.transferTokens({
        payeeFioPublicKey: publicKey2,
        amount: defaultFee * 4,
        maxFee: defaultFee,
    })
    await timeout(receiveTransferTimout)

    try {
        const isAvailableResult = await fioSdk.genericAction('isAvailable', {
            fioName: testDomain,
        })
        if (!isAvailableResult.is_registered) {
            await fioSdk.genericAction('registerFioDomain', {
                fioDomain: testDomain,
                maxFee: defaultFee,
            })
        }

        await fioSdk.genericAction('setFioDomainVisibility', {
            fioDomain: testDomain,
            isPublic: true,
            maxFee: defaultFee,
            technologyProviderId: '',
        })

        const isAvailableResult3 = await fioSdk2.genericAction('isAvailable', {
            fioName: testDomain2,
        })
        if (!isAvailableResult3.is_registered) {
            await fioSdk2.genericAction('registerFioDomain', {
                fioDomain: testDomain2,
                maxFee: defaultFee,
            })
        }

        const isAvailableResult1 = await fioSdk.genericAction('isAvailable', {
            fioName: testFioAddressName,
        })
        if (!isAvailableResult1.is_registered) {
            await fioSdk.genericAction('registerFioAddress', {
                fioAddress: testFioAddressName,
                maxFee: defaultFee,
            })
        }

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
})

// We should add tests into describe and it blocks to await sdk instances and FIO Handles registrations
describe('', () => {
    it('', () => {
        RawAbiTests({ fioSdk });
        WrongRequestsTests({ fioSdk, baseUrls, fioSdkWithWrongBaseUrl });

        GenericActionsTests({ fioSdk, fioSdk2, publicKey, publicKey2, testFioDomainName, testFioAddressName });

        FioPermissionsTests({ fioSdk, publicKey, publicKey2 });
        AccountPermissionsTests({ fioSdk, fioSdk2, publicKey, publicKey2, testFioDomainName, testFioAddressName });

        VoteBlockProducerTests({ fioSdk, publicKey, proxyTpId, testFioAddressName });

        StakeTokensTests({ fioSdk, publicKey, testFioAddressName });

        NftsTests({ fioSdk, testFioAddressName });

        FioRequestApproveAndPayFundsTests({ fioSdk, fioSdk2, publicKey, publicKey2, testFioAddressName, testFioAddressName2 });
        FioRequestCancelTests({ fioSdk2, testFioAddressName, testFioAddressName2 });
        FioRequestRejectTests({ fioSdk, fioSdk2, testFioAddressName, testFioAddressName2 });
        FioRequestsWithDifferentEncryptKeysTests({ baseUrls, faucetPriv, faucetPub });
        RecordObtDataTests({ fioSdk, fioSdk2, publicKey, publicKey2, testFioAddressName, testFioAddressName2 });

        TransferTokensTests({ fioSdk, fioSdk2, publicKey2 });

        EncryptDecryptContentTests({ baseUrls });

        CheckTransactionTests({ fioSdk2, testFioAddressName, testFioAddressName2 });
    })
})
