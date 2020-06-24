import { FioDomainsResponse } from '../../entities/FioDomainsResponse'
import { Query } from './Query'

export class GetDomains extends Query<FioDomainsResponse> {
  public ENDPOINT: string = 'chain/get_fio_domains'
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
    return { fio_public_key: this.fioPublicKey, limit: this.limit || null, offset: this.offset || null }
  }
}
