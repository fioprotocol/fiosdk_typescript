import { NftItem } from './NftItem'

export interface NftsResponse {
  nfts: NftItem[],
  more: boolean
}
