import { AbiResponse } from '../../entities/AbiResponse'
import { Query } from './Query'

export class GetAbi extends Query<AbiResponse> {
  public ENDPOINT: string = 'chain/get_raw_abi'
  public accountName: string

  constructor(accountName: string) {
    super()
    this.accountName = accountName
  }

  public getData() {
    return {
      account_name: this.accountName,
    }
  }
}
