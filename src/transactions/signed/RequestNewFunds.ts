import { validationRules } from '../../utils/validation'
import { SignedTransaction } from './SignedTransaction'

export class RequestNewFunds extends SignedTransaction {

  public ENDPOINT: string = 'chain/new_funds_request'
  public ACTION: string = 'newfundsreq'
  public ACCOUNT: string = 'fio.reqobt'

  public payerFioAddress: string
  public payerFioPublicKey: string
  public payeeFioAddress: string
  public chainCode: string
  public tokenCode: string
  public maxFee: number
  public content: any
  public technologyProviderId: string

  constructor(
    payerFioAddress: string,
    payerFioPublicKey: string,
    payeeFioAddress: string,
    technologyProviderId: string = '',
    maxFee: number,
    payeeTokenPublicAddress: string,
    amount: number,
    chainCode: string,
    tokenCode: string,
    memo: string | null = null,
    hash: string | null = null,
    offlineUrl: string | null = null,
  ) {
    super()
    this.validationData = { payerFioAddress, payeeFioAddress, tokenCode, tpid: technologyProviderId || null }
    this.validationRules = validationRules.newFundsRequest

    this.payerFioAddress = payerFioAddress
    this.payerFioPublicKey = payerFioPublicKey
    this.payeeFioAddress = payeeFioAddress
    this.chainCode = chainCode
    this.tokenCode = tokenCode
    this.maxFee = maxFee
    this.content = {
      payee_public_address: payeeTokenPublicAddress,
      amount: `${amount}`,
      chain_code: chainCode,
      token_code: tokenCode,
      memo,
      hash,
      offline_url: offlineUrl,
    }

    if (technologyProviderId) {
      this.technologyProviderId = technologyProviderId
    } else {
      this.technologyProviderId = ''
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
      tpid: this.technologyProviderId,
      actor,
    }
    return data
  }

}
