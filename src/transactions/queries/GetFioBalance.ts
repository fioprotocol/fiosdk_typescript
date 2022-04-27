import { BalanceResponse } from '../../entities/BalanceResponse'
import { Query } from './Query'

export class GetFioBalance extends Query<BalanceResponse> {
  public ENDPOINT: string = 'chain/get_fio_balance'
  public keyToUse: string

  constructor(othersBalance?: string) {
    super()
    this.keyToUse = othersBalance || ''
  }

  public getData() {
    return { fio_public_key: this.keyToUse || this.publicKey }
  }

}
