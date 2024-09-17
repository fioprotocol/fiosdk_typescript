import {
    ContentType,
    EncryptKeyResponse,
    EndPoint,
    FioItem,
    FioSentItem, FioSentItemContent,
    GetObtDataDecryptedResponse,
    GetObtDataResponse,
} from '../../entities'
import {getEncryptKeyForUnCipherContent} from '../../utils/utils'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type ObtDataQueryProps = {
    fioPublicKey: string,
    limit?: number,
    offset?: number,
    tokenCode?: string,
    includeEncrypted?: boolean,
    encryptKeys?: Map<string, Array<{ privateKey: string, publicKey: string }>>,
    getEncryptKey: (fioAddress: string) => Promise<EncryptKeyResponse>,
}

export type ObtDataQueryData = {
    fio_public_key: string
    limit?: number
    offset?: number,
}

export class ObtDataQuery extends Query<ObtDataQueryData, GetObtDataDecryptedResponse> {
    public ENDPOINT = `chain/${EndPoint.getObtData}` as const

    public isEncrypted = true

    public props: ReturnType<ObtDataQuery['getResolvedProps']>

    constructor(config: RequestConfig, props: ObtDataQueryProps) {
        super(config)

        this.props = this.getResolvedProps(props)
    }

    public getData = () => ({
        fio_public_key: this.props.fioPublicKey,
        limit: this.props.limit,
        offset: this.props.offset,
    })

    public getResolvedProps = (props: ObtDataQueryProps) => ({
        ...props,
        includeEncrypted: props.includeEncrypted ?? false,
        tokenCode: props.tokenCode ?? '',
    })

    public async decrypt(result: GetObtDataResponse): Promise<GetObtDataDecryptedResponse> {
        return new Promise(async (resolve, reject) => {
            if (result.obt_data_records && result.obt_data_records.length > 0) {
                try {
                    const requests = await Promise.allSettled(result.obt_data_records.map(
                        async (obtDataRecord: FioItem) => {
                            const encryptPublicKeysArray: string[] = []
                            let encryptPrivateKeysArray: string[] = []

                            const {
                                content: obtDataRecordContent,
                                payee_fio_address,
                                payee_fio_public_key,
                                payer_fio_address,
                                payer_fio_public_key,
                            } = obtDataRecord || {}

                            try {
                                const payerEncryptKeyRes = await getEncryptKeyForUnCipherContent({
                                    fioAddress: payer_fio_address,
                                    getEncryptKey: this.props.getEncryptKey,
                                    method: 'GetObtData',
                                })
                                if (payerEncryptKeyRes) {
                                    encryptPublicKeysArray.push(payerEncryptKeyRes)
                                }
                            } catch (error) {
                                // tslint:disable-next-line:no-console
                                console.error(error)
                            }
                            try {
                                const payeeEncryptKeyRes = await getEncryptKeyForUnCipherContent({
                                    fioAddress: payee_fio_address,
                                    getEncryptKey: this.props.getEncryptKey,
                                    method: 'GetObtData',
                                })
                                if (payeeEncryptKeyRes) {
                                    encryptPublicKeysArray.push(payeeEncryptKeyRes)
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

                            if (payer_fio_public_key) {
                                encryptPublicKeysArray.push(payer_fio_public_key)
                            }

                            encryptPublicKeysArray.push(this.publicKey)
                            encryptPrivateKeysArray.push(this.privateKey)

                            let content: FioSentItemContent | null = null

                            try {
                                for (const publicKey of encryptPublicKeysArray) {
                                    for (const privateKey of encryptPrivateKeysArray) {
                                        let unCipherContent = null
                                        try {
                                            unCipherContent = this.getUnCipherContent(
                                                ContentType.recordObtDataContent,
                                                obtDataRecordContent,
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
                                    throw new Error(`GetObtData: Get UnCipher Content for account ${account} failed.`)
                                }
                            } catch (error) {
                                // tslint:disable-next-line:no-console
                                console.error(error)
                                throw error
                            }

                            if (content) {
                                if (this.props.tokenCode
                                    && content.token_code
                                    && content.token_code !== this.props.tokenCode) {
                                    return null
                                }

                                return { ...obtDataRecord, content }
                            }

                            return obtDataRecord
                        },
                    ))

                    const fulfilledRequests: Array<FioItem | FioSentItem> = []

                    requests.forEach(
                        (req) => req.status === 'fulfilled' && req.value && fulfilledRequests.push(req.value),
                    )

                    resolve({obt_data_records: fulfilledRequests, more: result.more})
                } catch (error) {
                    reject(error)
                }
            } else {
                resolve({...result, obt_data_records: []})
            }
        })
    }
}
