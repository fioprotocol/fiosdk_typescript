import {RequestStatus} from '../RequestStatus'

export type FioSentItemContent = {
    payer_public_address?: string | undefined
    payee_public_address: string
    amount: string
    chain_code: string
    token_code: string
    status?: RequestStatus
    obt_id?: string
    memo: string | null
    hash: string | null
    offline_url: string | null,
}

export type FioSentItem = {
    fio_request_id: number
    payer_fio_address: string
    payee_fio_address: string
    payee_fio_public_key: string
    payer_fio_public_key: string
    status: RequestStatus
    time_stamp: string
    content: FioSentItemContent,
}
