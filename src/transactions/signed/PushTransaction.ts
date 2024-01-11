import { Constants } from '../../utils/constants'
import { SignedTransaction } from './SignedTransaction'

export interface EncryptOptions { publicKey?: string; privateKey?: string; contentType?: string }

export class PushTransaction extends SignedTransaction {

  public ENDPOINT: string = 'chain/push_transaction'
  public ACTION: string = ''
  public ACCOUNT: string = Constants.defaultAccount
  public data: any
  public encryptOptions: EncryptOptions
  public authPermission: string | undefined
  public signingAccount: string | undefined

  constructor({
    action,
    account,
    authPermission,
    data,
    encryptOptions = {},
    signingAccount,
  }: {
    action: string,
    account: string,
    authPermission: string | undefined,
    data: any,
    encryptOptions: EncryptOptions,
    signingAccount: string | undefined,
}) {
    super()
    this.ACTION = action
    if (account) { this.ACCOUNT = account }
    this.data = data
    this.encryptOptions = encryptOptions
    this.authPermission = authPermission
    this.signingAccount = signingAccount
  }

  public getData(): any {
    const data = { ...this.data }
    if (data.content && this.encryptOptions && this.encryptOptions.publicKey && this.encryptOptions.contentType) {
      data.content = this.getCipherContent(
        this.encryptOptions.contentType,
        data.content,
        this.encryptOptions.privateKey || this.privateKey,
        this.encryptOptions.publicKey,
      )
    }

    return {
      ...data,
      actor: this.data.actor != null && this.data.actor !== '' ? this.data.actor : this.getActor(),
    }
  }

}
