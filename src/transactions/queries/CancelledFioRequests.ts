import {
    CancelledFioRequestsDecryptedResponse,
    CancelledFioRequestResponse,
    ContentType,
    GetEncryptKeyResponse,
    EndPoint,
    FioItem,
    FioSentItem,
    FioSentItemContent,
    KeysPair,
} from '../../entities'
import {getAccountPrivateKeys, getDecryptedContent, getEncryptKeyForUnCipherContent} from '../../utils/utils'
import {RequestConfig} from '../Transactions'

import {Query} from './Query'

export type CancelledFioRequestsQueryProps = {
    fioPublicKey: string
    limit?: number
    offset?: number
    encryptKeys?: Map<string, KeysPair[]>
    getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>,
}

export type CancelledFioRequestsQueryData = {
    fio_public_key: string,
    limit?: number,
    offset?: number,
}

export class CancelledFioRequestsQuery extends Query<
    CancelledFioRequestsQueryData,
    CancelledFioRequestsDecryptedResponse | undefined
> {
    public ENDPOINT = `chain/${EndPoint.getCancelledFioRequests}` as const

    public isEncrypted = true

    constructor(config: RequestConfig, public props: CancelledFioRequestsQueryProps) {
        super(config)
    }

    public getData = () => ({
        fio_public_key: this.props.fioPublicKey,
        limit: this.props.limit,
        offset: this.props.offset,
    })

    public async decrypt(
        result: CancelledFioRequestResponse,
    ): Promise<CancelledFioRequestsDecryptedResponse | undefined> {
        return new Promise(async (resolve, reject) => {
            if (result.requests.length > 0) {
                try {
                    const requests = await Promise.allSettled(result.requests.map(async (value: FioItem) => {
                        const account = this.getActor()

                        const encryptPublicKeysArray = this.publicKey ? [this.publicKey] : []
                        const encryptPrivateKeysArray = this.privateKey ? [this.privateKey] : []

                        const accountPrivateKeys = getAccountPrivateKeys(account, this.props.encryptKeys)

                        if (accountPrivateKeys.length > 0) {
                            encryptPrivateKeysArray.push(...accountPrivateKeys)
                        }

                        const {payer_fio_address, payer_fio_public_key} = value || {}

                        try {
                            const unCipherEncryptKey = await getEncryptKeyForUnCipherContent({
                                fioAddress: payer_fio_address,
                                getEncryptKey: this.props.getEncryptKey,
                                method: 'CancelledFioRequests',
                            })
                            if (unCipherEncryptKey) {
                                encryptPublicKeysArray.push(unCipherEncryptKey)
                            }
                        } catch (error) {
                            // tslint:disable-next-line:no-console
                            console.error(error)
                        }

                        if (payer_fio_public_key) {
                            encryptPublicKeysArray.push(payer_fio_public_key)
                        }

                        const content = getDecryptedContent<FioSentItemContent>(
                            ContentType.newFundsContent,
                            value.content,
                            encryptPublicKeysArray,
                            encryptPrivateKeysArray,
                        )

                        if (content === null) {
                            // Throw an error if all keys failed
                            throw new Error(`CancelledFioRequests: Get UnCipher Content for account ${account} failed.`)
                        }

                        return {...value, content}
                    }))

                    const fulfilledRequests: FioSentItem[] = []

                    requests.forEach(
                        (req) => req.status === 'fulfilled' && fulfilledRequests.push(req.value as FioSentItem),
                    )

                    resolve({requests: fulfilledRequests, more: result.more})
                } catch (error) {
                    reject(error)
                }
            } else {
                resolve(undefined)
            }
        })
    }
}
