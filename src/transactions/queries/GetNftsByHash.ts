import { Query } from './Query'
import { NftsResponse } from '../../entities/NftsResponse'


export class GetNftsByHash extends Query<NftsResponse> {
  ENDPOINT: string = 'chain/get_nfts_hash'
  hash: string
  limit: number | null
  offset: number | null


  constructor(hash: string, limit?: number, offset?: number) {
    super()
    this.hash = hash
    this.limit = limit || null
    this.offset = offset || null
  }

  getData() {
    return {
      hash: this.hash,
      limit: this.limit || null,
      offset: this.offset || null
    }
  }
}
