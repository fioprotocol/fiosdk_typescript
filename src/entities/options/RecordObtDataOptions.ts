import {RequestStatus} from '../RequestStatus'

export type RecordObtDataOptions = {
    obtId: string
    amount: number
    chainCode: string
    tokenCode: string
    maxFee: number
    payeeFioAddress: string
    payerFioAddress: string
    payeeTokenPublicAddress: string
    payerTokenPublicAddress: string
    fioRequestId?: number | null
    hash?: string | null
    memo?: string | null
    offLineUrl?: string | null
    payeeFioPublicKey?: string | null
    status?: RequestStatus | null
    encryptPrivateKey?: string | null
    technologyProviderId?: string | null,
}
