import { Query } from './Query'

type Options = {
  decrypt?: {
    key: string,
    contentType: string
  },
  customEndpoint?: boolean
}
export class Get extends Query<any> {
  public ENDPOINT: string = ''
  private data: { [key: string]: any } = {}
  private decryptContentType: string = ''
  private decryptKey: string = ''

  constructor(endpoint: string, data: { [key: string]: any }, options: Options = {}) {
    super()
    this.ENDPOINT = options.customEndpoint ? endpoint : `chain/${endpoint}`
    this.data = data
    this.isEncrypted = !!options.decrypt
    this.decryptContentType = options.decrypt && options.decrypt.key ? options.decrypt.contentType : ''
    this.decryptKey = options.decrypt && options.decrypt.key ? options.decrypt.key : ''
  }

  public getData() {
    return this.data
  }

  public decrypt(result: any): any {
    if (result[this.decryptKey].length > 0) {
      const items: any[] = []
      result[this.decryptKey].forEach((value: { content: string, payer_fio_public_key: string, payee_fio_public_key: string }) => {
        try {
          let content
          if (value.payer_fio_public_key === this.publicKey) {
            content = this.getUnCipherContent(this.decryptContentType, value.content, this.privateKey, value.payee_fio_public_key)
          } else {
            content = this.getUnCipherContent(this.decryptContentType, value.content, this.privateKey, value.payer_fio_public_key)
          }
          value.content = content
          items.push(value)
        } catch (e) {
          //
        }
      })
      return { [this.decryptKey]: items, more: result.more }
    }
  }
}
