import {
    ContentType,
    GetEncryptKeyResponse,
    EndPoint,
    FioItem,
    FioSentItem, FioSentItemContent,
    GetObtDataDecryptedResponse,
    GetObtDataResponse, KeysPair,
} from '../../entities'
import {getAccountPrivateKeys, getDecryptedContent, getEncryptKeyForUnCipherContent} from '../../utils/utils'
import {RequestConfig} from '../Transactions'
import {Query} from './Query'

export type ObtDataQueryProps = {
    fioPublicKey: string,
    limit?: number,
    offset?: number,
    tokenCode?: string,
    includeEncrypted?: boolean,
    encryptKeys?: Map<string, KeysPair[]>,
    getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>,
}

export type ObtDataQueryData = {
    fio_public_key: string
    limit?: number
    offset?: number,
}

export class GetObtData extends Query<ObtDataQueryData, GetObtDataDecryptedResponse> {
    public ENDPOINT = `chain/${EndPoint.getObtData}` as const

    public isEncrypted = true

    public props: ReturnType<GetObtData['getResolvedProps']>

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
                            const account = this.getActor()

                            const encryptPublicKeysArray = this.publicKey ? [this.publicKey] : []
                            const encryptPrivateKeysArray = this.privateKey ? [this.privateKey] : []

                            const accountPrivateKeys = getAccountPrivateKeys(account, this.props.encryptKeys)

                            if (accountPrivateKeys.length > 0) {
                                encryptPrivateKeysArray.push(...accountPrivateKeys)
                            }

                            const {
                                content: obtDataRecordContent,
                                payee_fio_address,
                                payee_fio_public_key,
                                payer_fio_address,
                                payer_fio_public_key,
                            } = obtDataRecord || {}

                            for (const fioAddress of [payer_fio_address, payee_fio_address]) {
                                try {
                                    const encryptKeyRes = await getEncryptKeyForUnCipherContent({
                                        fioAddress,
                                        getEncryptKey: this.props.getEncryptKey,
                                        method: 'GetObtData',
                                    })
                                    if (encryptKeyRes) {
                                        encryptPublicKeysArray.push(encryptKeyRes)
                                    }
                                } catch (error) {
                                    // tslint:disable-next-line:no-console
                                    console.error(error)
                                }
                            }

                            if (payee_fio_public_key) {
                                encryptPublicKeysArray.push(payee_fio_public_key)
                            }

                            if (payer_fio_public_key) {
                                encryptPublicKeysArray.push(payer_fio_public_key)
                            }

                            const content = getDecryptedContent<FioSentItemContent>(
                                ContentType.recordObtDataContent,
                                obtDataRecordContent,
                                encryptPublicKeysArray,
                                encryptPrivateKeysArray,
                            )

                            if (content === null) {
                                if (this.props.includeEncrypted) {
                                    return obtDataRecord
                                }
                                // Throw an error if all keys failed
                                throw new Error(`GetObtData: Get UnCipher Content for account ${account} failed.`)
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
