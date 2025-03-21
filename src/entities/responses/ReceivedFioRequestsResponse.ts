import {FioItem} from '../types/FioItem'
import {FioSentItem} from '../types/FioSentItem'

export type ReceivedFioRequestsResponse = {
    requests: FioItem[]
    more: number,
}

export type ReceivedFioRequestsDecryptedResponse = {
    requests: Array<FioItem | FioSentItem>
    more: number,
}
