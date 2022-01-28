import { Constants } from '../../utils/constants'
import { SignedTransaction } from './SignedTransaction'

export class PushTransaction extends SignedTransaction {

  public ENDPOINT: string = 'chain/push_transaction'
  public ACTION: string = ''
  public ACCOUNT: string = Constants.defaultAccount
  public data: any

  constructor(action: string, account: string, data: any) {
    super()
    this.ACTION = action
    if (account) { this.ACCOUNT = account }
    this.data = data
  }

  public getData(): any {
    return {
      ...this.data,
      actor: this.data.actor != null && this.data.actor != '' ? this.data.actor : this.getActor(),
    }
  }

}
