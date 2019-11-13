import { SignedTransaction } from './SignedTransaction'
import { validationRules } from '../../utils/validation'

export class TransferTokens extends SignedTransaction {

  ENDPOINT: string = 'chain/transfer_tokens_pub_key'
  ACTION: string = 'trnsfiopubky'
  ACCOUNT: string = 'fio.token'
  payeePublicKey: string
  amount: string
  maxFee: number
  walletFioAddress: string

  constructor(payeePublicKey: string, amount: number, maxFee: number, walletFioAddress: string = '') {
    super()
    this.payeePublicKey = payeePublicKey
    this.amount = `${amount}`
    this.walletFioAddress = walletFioAddress
    this.maxFee = maxFee

    this.validationData = { tpid: walletFioAddress }
    this.validationRules = validationRules.transferTokens
  }

  public prepareResponse(result: any): any {
    if (!result.processed) return result

    const apiResponse = this.parseProcessedResult(result.processed)
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
      tpid: this.walletFioAddress,
      actor: actor
    }
    return data
  }

}