import { GetAccountPubKeyResponse } from '../../entities/GetAccountPubKeyResponse'
import { Query } from './Query'

export class GetAccountPubKey extends Query<GetAccountPubKeyResponse> {
  public ENDPOINT: string = 'chain/get_account_fio_public_key'
  public account: string

  constructor(account: string) {
    super()
    this.account = account
  }

  public getData() {
    return { account: this.account }
  }
}
