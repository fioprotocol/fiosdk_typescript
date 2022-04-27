import { NftsResponse } from '../../entities/NftsResponse'
import { Query } from './Query'

export class GetNftsByHash extends Query<NftsResponse> {
  public ENDPOINT: string = 'chain/get_nfts_hash'
  public hash: string
  public limit: number | null
  public offset: number | null

  constructor(hash: string, limit?: number, offset?: number) {
    super()
    this.hash = hash
    this.limit = limit || null
    this.offset = offset || null
  }

  public getData() {
    return {
      hash: this.hash,
      limit: this.limit || null,
      offset: this.offset || null,
    }
  }
}
