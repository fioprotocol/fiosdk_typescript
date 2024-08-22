import {CancelledFioRequestsResponse, EncryptKeyResponse, EndPoint, FioItem, KeysPair} from '../../entities'
import {getEncryptKeyForUnCipherContent} from '../../utils/utils'
import {RequestConfig} from '../Request'

import {Query} from './Query'

export type CancelledFioRequestsQueryProps = {
    fioPublicKey: string
    limit?: number
    offset?: number
    encryptKeys?: Map<string, KeysPair[]>
    getEncryptKey: (fioAddress: string) => Promise<EncryptKeyResponse>,
}

export type CancelledFioRequestsQueryData = {
    fio_public_key: string,
    limit?: number,
    offset?: number,
}

export class CancelledFioRequestsQuery extends Query<
    CancelledFioRequestsQueryData,
    CancelledFioRequestsResponse | undefined
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

    public async decrypt(result: CancelledFioRequestsResponse): Promise<CancelledFioRequestsResponse | undefined> {
        return new Promise(async (resolve, reject) => {
            if (result.requests.length > 0) {
                try {
                    const requests = await Promise.allSettled(result.requests.map(async (value: FioItem) => {
                        const encryptPublicKeysArray: string[] = []
                        let encryptPrivateKeysArray: string[] = []

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

                        if (payer_fio_public_key) {
                            encryptPublicKeysArray.push(payer_fio_public_key)
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
                                            // Exit the inner loop if a successful result is obtained
                                            break
                                        }
                                    } catch (error) {
                                        // tslint:disable-next-line:no-console
                                        console.error(error)
                                    }
                                }
                            }

                            if (content === null) {
                                // Throw an error if all keys failed
                                throw new Error(`CancelledFioRequests: Get UnCipher Content for account ${account} failed.`)
                            } else {
                                value.content = content
                            }
                        } catch (error) {
                            // tslint:disable-next-line:no-console
                            console.error(error)
                            throw error
                        }

                        return value
                    }))

                    const fulfilledRequests: FioItem[] = []

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
