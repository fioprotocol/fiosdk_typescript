/* tslint:disable:no-console */
import * as dotenv from 'dotenv'
import 'mocha'

import { RawAbiTests } from './common/raw-abi.spec';
import { WrongRequestsTests } from './common/wrong-requests.spec';
import { GenericActionsTests } from './common/generic-actions.spec';
import { AccountPermissionsTests } from './common/account-permissions.spec';
import { FioPermissionsTests } from './common/fio-permissions.spec';
import { VoteBlockProducerTests } from './common/vote-blockproducer.spec';
import { StakeTokensTests } from './common/stake-tokens.spec';
import { NftsTests } from './common/nfts.spec';
import { FioRequestApproveAndPayFundsTests } from './common/fio-request-approve-pay-funds.spec';
import { FioRequestCancelTests } from './common/fio-request-cancel.spec';

import {
    FIOSDK,
} from '../src/FIOSDK';

import { defaultFee } from './constants';
import { FioRequestRejectTests } from './common/fio-request-reject.spec';
import { TransferTokensTests } from './common/transfer-tokens.spec';
import { RecordObtDataTests } from './common/record-obt-data.spec';
import { CheckTransactionTests } from './common/check-transaction.spec';
import { timeout, fetchJson } from './utils';
import { EncryptDecryptContentTests } from './common/encrypt-decrypt-content.spec';
import { FioRequestsWithDifferentEncryptKeysTests } from './common/fio-requests-with-different-encrypt-keys.spec';

dotenv.config({path: ['.env.test', '.env']})

/**
 * Please set your private/public keys and existing fioAddresses
 */
const privateKey = process.env.PRIVATE_KEY as string
const publicKey = process.env.PUBLIC_KEY as string

const privateKey2 = process.env.PRIVATE_KEY_2 as string
const publicKey2 = process.env.PUBLIC_KEY_2 as string

const faucetPriv = process.env.FAUCET_PRIVATE_KEY as string
const faucetPub = process.env.FAUCET_PUBLIC_KEY as string

const testFioAddressName = process.env.TEST_FIO_ADDRESS_NAME as string
const testFioAddressName2 = process.env.TEST_FIO_ADDRESS_NAME_2 as string
const testFioDomainName = process.env.TEST_FIO_DOMAIN_NAME as string

/**
 * Public Testnet API nodes can be found at: https://bpmonitor.fio.net/?chain=Testnet
 */

const baseUrls = ['https://test.fio.eosusa.io/v1/']

const proxyTpId = 'eosusa@fiotestnet';

let fioSdk: FIOSDK = new FIOSDK({ privateKey, publicKey, apiUrls: baseUrls, fetchJson })
let fioSdk2: FIOSDK = new FIOSDK({ privateKey: privateKey2, publicKey: publicKey2, apiUrls: baseUrls, fetchJson })
let fioSdkWithWrongBaseUrl: FIOSDK = new FIOSDK({ privateKey: privateKey2, publicKey: publicKey2, apiUrls: baseUrls, fetchJson })

before(async () => {
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

    await timeout(4000)
})

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

