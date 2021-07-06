import { Query } from './Query'
import { AccountResponse } from '../../entities/AccountResponse'

export class GetAccount extends Query<AccountResponse> {
  public ENDPOINT: string = 'chain/get_account'
  public accountToUse: string

  constructor(actor: string) {
    super()
    this.accountToUse = actor
  }

  public getData() {
    return { account_name: this.accountToUse }
  }

}
