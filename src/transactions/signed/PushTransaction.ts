import { SignedTransaction } from './SignedTransaction'
import { Constants } from '../../utils/constants'

export class PushTransaction extends SignedTransaction {

  ENDPOINT: string = 'chain/push_transaction'
  ACTION: string = ''
  ACCOUNT: string = Constants.defaultAccount
  data: any
  additionalReturnKeys: { [key: string]: string[] } = {}

  constructor(action: string, data: any, options: { [key: string]: any } = {}) {
    super()
    this.ACTION = action
    if (options.account) this.ACCOUNT = options.account
    if (options.additionalReturnKeys) this.additionalReturnKeys = options.additionalReturnKeys
    this.data = data
  }

  private getByPath(obj: any, path: string[]): any {
      let current = obj;
      for (let i = 0; i < path.length; i++) {
        if (!current[path[i]]) return null;
        current = current[path[i]];
      }

      return current;
  }

  public prepareResponse(result: any): any {
    if (!Object.keys(this.additionalReturnKeys).length || !result.processed)
      return SignedTransaction.prepareResponse(result)

    const apiResponse = SignedTransaction.parseProcessedResult(result.processed)
    const response = { ...apiResponse }
    for (const key in this.additionalReturnKeys) {
      response[key] = this.getByPath(result, this.additionalReturnKeys[key])
    }
    return response
  }

  getData(): any {
    let actor = this.getActor()
    let data = {
      ...this.data,
      actor: actor
    }
    return data
  }

}
