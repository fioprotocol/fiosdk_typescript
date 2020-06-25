import { FioAddressesResponse } from '../../entities/FioAddressesResponse'
import { Query } from './Query'

export class GetAddresses extends Query<FioAddressesResponse> {
  public ENDPOINT: string = 'chain/get_fio_addresses'
  public fioPublicKey: string
  public limit: number | null
  public offset: number | null

  constructor(fioPublicKey: string, limit: number | null = null, offset: number | null = null) {
    super()
    this.fioPublicKey = fioPublicKey
    this.limit = limit
    this.offset = offset
  }

  public getData() {
    return { fio_public_key: this.fioPublicKey, limit: this.limit || null, offset: this.offset || null  }
  }
}
