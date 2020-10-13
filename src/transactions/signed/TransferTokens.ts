import { SignedTransaction } from './SignedTransaction'
import { validationRules } from '../../utils/validation'

export class TransferTokens extends SignedTransaction {

  ENDPOINT: string = 'chain/transfer_tokens_pub_key'
  ACTION: string = 'trnsfiopubky'
  ACCOUNT: string = 'fio.token'
  payeePublicKey: string
  amount: string
  maxFee: number
  technologyProviderId: string

  constructor(payeePublicKey: string, amount: number, maxFee: number, technologyProviderId: string = '') {
    super()
    this.payeePublicKey = payeePublicKey
    this.amount = `${amount}`
    this.technologyProviderId = technologyProviderId
    this.maxFee = maxFee

    this.validationData = { tpid: technologyProviderId || null }
    this.validationRules = validationRules.transferTokens
  }

  public prepareResponse(result: any): any {
    if (!result.processed) return result

    const apiResponse = SignedTransaction.parseProcessedResult(result.processed)
    return {
      transaction_id: result.transaction_id,
      block_num: result.processed.block_num,
      ...apiResponse
    }
  }

  getData(): any {
    let actor = this.getActor()

    let data = {
      payee_public_key: this.payeePublicKey,
      amount: this.amount,
      max_fee: this.maxFee,
      tpid: this.technologyProviderId,
      actor: actor
    }
    return data
  }

}
