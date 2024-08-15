import {FioItem} from '../types/FioItem'

export type ReceivedFioRequestsResponse = {
    requests: FioItem[]
    more: number,
}
