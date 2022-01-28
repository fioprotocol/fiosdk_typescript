import { NftsResponse } from '../../entities/NftsResponse'
import { Query } from './Query'

export class GetNftsByFioAddress extends Query<NftsResponse> {
  public ENDPOINT: string = 'chain/get_nfts_fio_address'
  public fioAddress: string
  public limit: number | null
  public offset: number | null

  constructor(fioAddress: string, limit?: number, offset?: number) {
    super()
    this.fioAddress = fioAddress
    this.limit = limit || null
    this.offset = offset || null
  }

  public getData() {
    return {
      fio_address: this.fioAddress,
      limit: this.limit || null,
      offset: this.offset || null,
    }
  }
}
