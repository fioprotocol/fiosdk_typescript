import { PublicAddressesResponse } from '../../entities/PublicAddressesResponse'
import { Query } from './Query'

export class GetPublicAddresses extends Query<PublicAddressesResponse> {
  public ENDPOINT: string = 'chain/get_pub_addresses'
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
