import { FioSentRequestsItem } from './FioSentRequestsItem'

export interface SentFioRequestResponse {
  requests: FioSentRequestsItem[],
  more: number
}
