import { AccountResponse } from '../../entities/AccountResponse'
import { Query } from './Query'

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
