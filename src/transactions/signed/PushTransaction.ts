import { SignedTransaction } from './SignedTransaction'
import { Constants } from '../../utils/constants'

export class PushTransaction extends SignedTransaction {

  ENDPOINT: string = 'chain/push_transaction'
  ACTION: string = ''
  ACCOUNT: string = Constants.defaultAccount
  data: any

  constructor(action: string, account: string, data: any) {
    super()
    this.ACTION = action
    if (account) this.ACCOUNT = account
    this.data = data
  }

  getData(): any {
    return {
      ...this.data,
      actor: this.data.actor != null && this.data.actor != '' ? this.data.actor : this.getActor()
    }
  }

}
