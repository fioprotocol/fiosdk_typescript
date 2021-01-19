import { Query } from './Query'
import { PublicAddressesResponse } from '../../entities/PublicAddressesResponse'


export class GetPublicAddresses extends Query<PublicAddressesResponse> {
  ENDPOINT: string = 'chain/get_pub_addresses'
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
