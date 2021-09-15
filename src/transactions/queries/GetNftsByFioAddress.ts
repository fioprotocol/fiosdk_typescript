import { Query } from './Query'
import { NftsResponse } from '../../entities/NftsResponse'


export class GetNftsByFioAddress extends Query<NftsResponse> {
  ENDPOINT: string = 'chain/get_nfts_fio_address'
  fioAddress: string
  limit: number | null
  offset: number | null


  constructor(fioAddress: string, limit?: number, offset?: number) {
    super()
    this.fioAddress = fioAddress
    this.limit = limit || null
    this.offset = offset || null
  }

  getData() {
    return {
      fio_address: this.fioAddress,
      limit: this.limit || null,
      offset: this.offset || null
    }
  }
}
