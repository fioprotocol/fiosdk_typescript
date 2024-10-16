import {
    ContentType,
    EncryptKeyResponse,
    EndPoint,
    FioItem,
    FioSentItem, FioSentItemContent, KeysPair,
    ReceivedFioRequestsDecryptedResponse,
    ReceivedFioRequestsResponse,
} from '../../entities'
import {getAccountPrivateKeys, getDecryptedContent, getEncryptKeyForUnCipherContent} from '../../utils/utils'
import {RequestConfig} from '../Request'

import {Query} from './Query'

export type ReceivedFioRequestsQueryProps = {
    fioPublicKey: string
    limit?: number
    offset?: number
    includeEncrypted?: boolean
    encryptKeys?: Map<string, KeysPair[]>
    getEncryptKey: (fioAddress: string) => Promise<EncryptKeyResponse>,
}

export type ReceivedFioRequestsQueryData = {
    fio_public_key: string
    limit?: number
    offset?: number,
}

export class ReceivedFioRequestsQuery extends Query<
    ReceivedFioRequestsQueryData,
    ReceivedFioRequestsDecryptedResponse | undefined
> {
    public ENDPOINT = `chain/${EndPoint.getReceivedFioRequests}` as const

    public isEncrypted = true

    constructor(config: RequestConfig, public props: ReceivedFioRequestsQueryProps) {
        super(config)
    }

    public getData = () => ({
        fio_public_key: this.props.fioPublicKey,
        limit: this.props.limit,
        offset: this.props.offset,
    })

    public async decrypt(
        result: ReceivedFioRequestsResponse,
    ): Promise<ReceivedFioRequestsDecryptedResponse | undefined> {
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

                        const {payee_fio_address, payee_fio_public_key} = value || {}

                        try {
                            const unCipherEncryptKey = await getEncryptKeyForUnCipherContent({
                                fioAddress: payee_fio_address,
                                getEncryptKey: this.props.getEncryptKey,
                                method: 'ReceivedFioRequests',
                            })
                            if (unCipherEncryptKey) {
                                encryptPublicKeysArray.push(unCipherEncryptKey)
                            }
                        } catch (error) {
                            // tslint:disable-next-line:no-console
                            console.error(error)
                        }

                        if (payee_fio_public_key) {
                            encryptPublicKeysArray.push(payee_fio_public_key)
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
                            throw new Error(`ReceivedFioRequests: Get UnCipher Content for account ${account} failed.`)
                        }

                        return { ...value, content }
                    }))

                    const fulfilledRequests: Array<FioItem | FioSentItem> = []

                    requests.forEach((req) => req.status === 'fulfilled' && fulfilledRequests.push(req.value))

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
