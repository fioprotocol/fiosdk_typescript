import { FioRequest } from '../../entities/FioRequest'
import { ReceivedFioRequestsResponse } from '../../entities/ReceivedFioRequestsResponse'
import { Query } from './Query'

export class ReceivedFioRequests extends Query<ReceivedFioRequestsResponse> {
  public ENDPOINT: string = 'chain/get_received_fio_requests'
  public fioPublicKey: string
  public limit: number | null
  public offset: number | null
  public includeEncrypted: boolean
  public isEncrypted = true

  constructor(fioPublicKey: string, limit: number | null = null, offset: number | null = null, includeEncrypted: boolean = false) {
    super()
    this.fioPublicKey = fioPublicKey
    this.limit = limit
    this.offset = offset
    this.includeEncrypted = includeEncrypted
  }

  public getData() {
    const data = { fio_public_key: this.fioPublicKey, limit: this.limit || null, offset: this.offset || null }

    return data
  }

  public decrypt(result: any): any {
    if (result.requests.length > 0) {
      const requests: FioRequest[] = []
      result.requests.forEach((value: FioRequest) => {
        try {
          let content
          if (value.payer_fio_public_key === this.publicKey) {
            content = this.getUnCipherContent('new_funds_content', value.content, this.privateKey, value.payee_fio_public_key)
          } else {
            content = this.getUnCipherContent('new_funds_content', value.content, this.privateKey, value.payer_fio_public_key)
          }
          value.content = content
          requests.push(value)
        } catch (e) {
          if (this.includeEncrypted) requests.push(value)
        }
      })
      return { requests, more: result.more }
    }
  }
}
