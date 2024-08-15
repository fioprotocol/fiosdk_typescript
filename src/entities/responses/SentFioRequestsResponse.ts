import {FioSentItem} from '../types/FioSentItem'

export type SentFioRequestsResponse = {
    requests: FioSentItem[]
    more: number,
}
