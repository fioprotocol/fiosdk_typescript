import { validationRules } from '../../utils/validation'
import { SignedTransaction } from './SignedTransaction'

export class TransferTokens extends SignedTransaction {

  public ENDPOINT: string = 'chain/transfer_tokens_pub_key'
  public ACTION: string = 'trnsfiopubky'
  public ACCOUNT: string = 'fio.token'
  public payeePublicKey: string
  public amount: string
  public maxFee: number
  public technologyProviderId: string

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
    if (!result.processed) { return result }

    const apiResponse = SignedTransaction.parseProcessedResult(result.processed)
    return {
      transaction_id: result.transaction_id,
      block_num: result.processed.block_num,
      ...apiResponse,
    }
  }

  public getData(): any {
    const actor = this.getActor()

    const data = {
      payee_public_key: this.payeePublicKey,
      amount: this.amount,
      max_fee: this.maxFee,
      tpid: this.technologyProviderId,
      actor,
    }
    return data
  }

}
