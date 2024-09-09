import {FioItem} from '../types/FioItem'
import {FioSentItem} from '../types/FioSentItem'

export type PendingFioRequestsResponse = {
    requests: FioItem[]
    more: number,
}

export type PendingFioRequestsDecryptedResponse = {
    requests: FioSentItem[]
    more: number,
}
