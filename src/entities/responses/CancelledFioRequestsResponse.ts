import {FioItem} from '../types/FioItem'
import {FioSentItem} from '../types/FioSentItem'

export type CancelledFioRequestsResponse = {
    requests: FioItem[]
    more: number,
}

export type CancelledFioRequestsDecryptedResponse = {
    requests: FioSentItem[]
    more: number,
}
