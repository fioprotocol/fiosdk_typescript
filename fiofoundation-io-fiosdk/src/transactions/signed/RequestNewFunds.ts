import { validationRules } from '../../utils/validation'
import { SignedTransaction } from './SignedTransaction'

export class RequestNewFunds extends SignedTransaction {

  public ENDPOINT: string = 'chain/new_funds_request'
  public ACTION: string = 'newfundsreq'
  public ACCOUNT: string = 'fio.reqobt'

  public payerFioAddress: string
  public payerFioPublicKey: string
  public payeeFioAddress: string
  public tokenCode: string
  public maxFee: number
  public content: any
  public walletFioAddress: string

  constructor(
    payerFioAddress: string,
    payerFioPublicKey: string,
    payeeFioAddress: string,
    walletFioAddress: string = '',
    maxFee: number,
    payeePublicAddress: string,
    amount: string,
    tokenCode: string,
    memo: string | null = null,
    hash: string | null = null,
    offlineUrl: string | null = null,
  ) {
    super()
    this.validationData = { payerFioAddress, payeeFioAddress, tokenCode, walletFioAddress }
    this.validationRules = validationRules.newFundsRequest

    this.payerFioAddress = payerFioAddress
    this.payerFioPublicKey = payerFioPublicKey
    this.payeeFioAddress = payeeFioAddress
    this.tokenCode = tokenCode
    this.maxFee = maxFee
    this.content = {
      payee_public_address: payeePublicAddress,
      amount,
      token_code: tokenCode,
      memo,
      hash,
      offline_url: offlineUrl,
    }

    if (walletFioAddress) {
      this.walletFioAddress = walletFioAddress
    } else {
      this.walletFioAddress = ''
    }
  }

  public getData(): any {
    const actor = this.getActor()
    const cipherContent = this.getCipherContent('new_funds_content', this.content, this.privateKey, this.payerFioPublicKey)
    const data = {
      payer_fio_address: this.payerFioAddress,
      payee_fio_address: this.payeeFioAddress,
      content: cipherContent,
      max_fee: this.maxFee,
      tpid: this.walletFioAddress,
      actor,
    }
    return data
  }

}
