import {FioItem} from '../types/FioItem'
import {FioSentItem} from '../types/FioSentItem'

export type SentFioRequestsResponse = {
    requests: FioItem[]
    more: number,
}

export type SentFioRequestsDecryptedResponse = {
    requests: Array<FioItem | FioSentItem>
    more: number,
}
