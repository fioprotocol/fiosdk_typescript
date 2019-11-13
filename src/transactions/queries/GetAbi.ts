import { Query } from './Query'
import { AbiResponse } from '../../entities/ABIResponse'

export class GetAbi extends Query<AbiResponse> {
  ENDPOINT: string = 'chain/get_raw_abi'
  accountName: string


  constructor(accountName: string) {
    super()
    this.accountName = accountName
  }

  getData() {
    return {
      account_name: this.accountName
    }
  }
}