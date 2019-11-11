import { FioRequestsItem } from './FioRequestsItem'

export interface PendingFioRequestsResponse {
  requests: FioRequestsItem[],
  more: number
}
