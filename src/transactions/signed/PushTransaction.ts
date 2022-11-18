import { Constants } from '../../utils/constants'
import { SignedTransaction } from './SignedTransaction'

export interface EncryptOptions { key?: string; contentType?: string }

export class PushTransaction extends SignedTransaction {

  public ENDPOINT: string = 'chain/push_transaction'
  public ACTION: string = ''
  public ACCOUNT: string = Constants.defaultAccount
  public data: any
  public encryptOptions: EncryptOptions

  constructor(
    action: string,
    account: string,
    data: any,
    encryptOptions: EncryptOptions = {},
  ) {
    super()
    this.ACTION = action
    if (account) { this.ACCOUNT = account }
    this.data = data
    this.encryptOptions = encryptOptions
  }

  public getData(): any {
    const data = { ...this.data }
    if (data.content && this.encryptOptions && this.encryptOptions.key && this.encryptOptions.contentType) {
      data.content = this.getCipherContent(
        this.encryptOptions.contentType,
        data.content,
        this.privateKey,
        this.encryptOptions.key,
      )
    }

    return {
      ...data,
      actor: this.data.actor != null && this.data.actor !== '' ? this.data.actor : this.getActor(),
      permission: this.data.permission || 'active',
    }
  }

}
