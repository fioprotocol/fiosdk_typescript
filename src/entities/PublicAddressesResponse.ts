import { PublicAddress } from './PublicAddress'

export interface PublicAddressesResponse {
  requests: PublicAddress[],
  more: boolean
}
