import {
    ContentType,
    EncryptKeyResponse,
    EndPoint,
    FioItem,
    FioSentItem,
    FioSentItemContent, KeysPair,
    SentFioRequestsDecryptedResponse,
    SentFioRequestsResponse,
} from '../../entities'
import {getAccountPrivateKeys, getDecryptedContent, getEncryptKeyForUnCipherContent} from '../../utils/utils'
import {RequestConfig} from '../Request'

import {Query} from './Query'

export type SentFioRequestsQueryProps = {
    fioPublicKey: string,
    limit?: number,
    offset?: number,
    includeEncrypted?: boolean,
    encryptKeys?: Map<string, KeysPair[]>,
    getEncryptKey: (fioAddress: string) => Promise<EncryptKeyResponse>,
}

export type SentFioRequestsQueryData = {
    fio_public_key: string
    limit?: number
    offset?: number,
}

export class SentFioRequestsQuery extends Query<
    SentFioRequestsQueryData,
    SentFioRequestsDecryptedResponse | undefined
> {
    public ENDPOINT = `chain/${EndPoint.getSentFioRequests}` as const

    public isEncrypted = true

    constructor(config: RequestConfig, public props: SentFioRequestsQueryProps) {
        super(config)
    }

    public getData = () => ({
        fio_public_key: this.props.fioPublicKey,
        limit: this.props.limit,
        offset: this.props.offset,
    })

    public async decrypt(result: SentFioRequestsResponse): Promise<SentFioRequestsDecryptedResponse | undefined> {
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
                                method: 'SentFioRequests',
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
                            if (this.props.includeEncrypted) {
                                return value
                            }

                            // Throw an error if all keys failed
                            throw new Error(`SentFioRequests: Get UnCipher Content for account ${account} failed.`)
                        }

                        return {...value, content}
                    }))

                    const fulfilledRequests: Array<FioItem | FioSentItem> = []

                    requests.forEach(
                        (req) => req.status === 'fulfilled' && fulfilledRequests.push(req.value),
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
