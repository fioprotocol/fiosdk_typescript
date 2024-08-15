import {FioItem} from '../types/FioItem'

export type PendingFioRequestsResponse = {
    requests: FioItem[]
    more: number,
}
