import { FioRequestsItem } from './FioRequestsItem'

export interface ReceivedFioRequestsResponse {
  requests: FioRequestsItem[],
  more: number
}
