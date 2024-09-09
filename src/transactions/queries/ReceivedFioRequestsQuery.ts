import {
    EncryptKeyResponse,
    EndPoint,
    FioItem,
    FioSentItem,
    ReceivedFioRequestsDecryptedResponse,
    ReceivedFioRequestsResponse,
} from '../../entities'
import {getEncryptKeyForUnCipherContent} from '../../utils/utils'
import {RequestConfig} from '../Request'

import {Query} from './Query'

export type ReceivedFioRequestsQueryProps = {
    fioPublicKey: string
    limit?: number
    offset?: number
    includeEncrypted?: boolean
    encryptKeys?: Map<string, Array<{ privateKey: string, publicKey: string }>>
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
                        const encryptPublicKeysArray: string[] = []
                        let encryptPrivateKeysArray: string[] = []

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

                        const account = this.getActor()

                        if (this.props.encryptKeys) {
                            const accountEncryptKeys = this.props.encryptKeys.get(account)
                            if (accountEncryptKeys && accountEncryptKeys.length > 0) {
                                encryptPrivateKeysArray =
                                    encryptPrivateKeysArray.concat(
                                        accountEncryptKeys.map(
                                            (accountEncryptKey) =>
                                                accountEncryptKey.privateKey,
                                        ),
                                    )
                            }
                        }

                        if (payee_fio_public_key) {
                            encryptPublicKeysArray.push(payee_fio_public_key)
                        }

                        encryptPublicKeysArray.push(this.publicKey)
                        encryptPrivateKeysArray.push(this.privateKey)

                        let content = null

                        try {
                            for (const publicKey of encryptPublicKeysArray) {
                                for (const privateKey of encryptPrivateKeysArray) {
                                    let unCipherContent = null
                                    try {
                                        unCipherContent = this.getUnCipherContent(
                                            'new_funds_content',
                                            value.content,
                                            privateKey,
                                            publicKey,
                                        )
                                        if (unCipherContent !== null) {
                                            content = unCipherContent
                                            break // Exit the inner loop if a successful result is obtained
                                        }
                                    } catch (error) {
                                        // tslint:disable-next-line:no-console
                                        console.error(error)
                                    }
                                }
                            }

                            if (content === null) {
                                throw new Error(`ReceivedFioRequests: Get UnCipher Content for account ${account} failed.`) // Throw an error if all keys failed
                            }

                            return { ...value, content }
                        } catch (error) {
                            if (this.props.includeEncrypted) {
                                return value
                            }

                            // tslint:disable-next-line:no-console
                            console.error(error)
                            throw error
                        }
                    }))

                    const fulfilledRequests: FioSentItem[] = []

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
