import { Query } from './Query'
import { EndPoint } from '../../entities/EndPoint';
import { Constants } from '../../utils/constants';

type Options = {
  customEndpoint?: boolean
}
const encryptedEndpoints = {
  [`${EndPoint.pendingFioRequests}`]: {
    decryptKey: 'requests',
    decryptContentType: Constants.CipherContentTypes.new_funds_content,
  },
  [`${EndPoint.sentFioRequests}`]: {
    decryptKey: 'requests',
    decryptContentType: Constants.CipherContentTypes.new_funds_content,
  },
  [`${EndPoint.getObtData}`]: {
    decryptKey: 'obt_data_records',
    decryptContentType: Constants.CipherContentTypes.record_obt_data_content,
  },
}

export class Get extends Query<any> {
  public ENDPOINT: string = ''
  private data: { [key: string]: any } = {}

  constructor(endpoint: string, data: { [key: string]: any }, options: Options = {}) {
    super()
    this.ENDPOINT = options.customEndpoint ? endpoint : `chain/${endpoint}`
    this.data = data
    this.isEncrypted = !!encryptedEndpoints[this.ENDPOINT]
  }

  public getData() {
    return this.data
  }

  public decrypt(result: any): any {
    const { decryptKey, decryptContentType } = encryptedEndpoints[this.ENDPOINT]
    if (result[decryptKey].length > 0) {
      const items: any[] = []
      result[decryptKey].forEach((value: { content: string, payer_fio_public_key: string, payee_fio_public_key: string }) => {
        try {
          let content
          if (value.payer_fio_public_key === this.publicKey) {
            content = this.getUnCipherContent(decryptContentType, value.content, this.privateKey, value.payee_fio_public_key)
          } else {
            content = this.getUnCipherContent(decryptContentType, value.content, this.privateKey, value.payer_fio_public_key)
          }
          value.content = content
          items.push(value)
        } catch (e) {
          //
        }
      })
      return { [decryptKey]: items, more: result.more }
    }
  }
}
