import { FioRequest } from '../../entities/FioRequest'
import { PendingFioRequestsResponse } from '../../entities/PendingFioRequestsResponse'
import { Query } from './Query'

export class PendingFioRequests extends Query<PendingFioRequestsResponse> {
  public ENDPOINT: string = 'chain/get_pending_fio_requests'
  public fioPublicKey: string
  public limit: number | null
  public offset: number | null
  public isEncrypted = true

  constructor(fioPublicKey: string, limit: number | null = null, offset: number | null = null) {
    super()
    this.fioPublicKey = fioPublicKey
    this.limit = limit
    this.offset = offset
  }

  public getData() {
    const data = { fio_public_key: this.fioPublicKey, limit: this.limit || null, offset: this.offset || null }

    return data
  }

  public decrypt(result: any): any {
    if (result.requests.length > 0) {
      const pendings: FioRequest[] = []
      result.requests.forEach((value: FioRequest) => {
        let content
        if (value.payer_fio_public_key === this.publicKey) {
          content = this.getUnCipherContent('new_funds_content', value.content, this.privateKey, value.payee_fio_public_key)
        } else {
          content = this.getUnCipherContent('new_funds_content', value.content, this.privateKey, value.payer_fio_public_key)
        }
        value.content = content
        pendings.push(value)
      })
      return pendings
    }
  }
}
