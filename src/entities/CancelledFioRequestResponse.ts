import { FioSentRequestsItem } from './FioSentRequestsItem'

export interface CancelledFioRequestResponse {
  requests: FioSentRequestsItem[],
  more: number
}
