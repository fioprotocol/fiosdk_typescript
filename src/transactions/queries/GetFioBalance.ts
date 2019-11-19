import { Query } from './Query'
import { BalanceResponse } from '../../entities/BalanceResponse'

export class GetFioBalance extends Query<BalanceResponse> {
  ENDPOINT: string = 'chain/get_fio_balance'
  keyToUse: string

  constructor(othersBalance?: string) {
    super()
    if (othersBalance) {
      this.keyToUse = othersBalance
    } else {
      this.keyToUse = this.publicKey
    }
  }

  getData() {
    return { fio_public_key: this.publicKey }
  }

}