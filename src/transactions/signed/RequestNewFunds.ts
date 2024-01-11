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
  public encryptPrivateKey: string | null

  constructor({
    amount,
    chainCode,
    encryptPrivateKey = null,
    hash = null,
    maxFee,
    memo = null,
    offlineUrl = null,
    payeeFioAddress,
    payeeTokenPublicAddress,
    payerFioAddress,
    payerFioPublicKey,
    technologyProviderId = '',
    tokenCode,
  }: {
    amount: number,
    chainCode: string,
    encryptPrivateKey: string | null,
    hash?: string | null,
    maxFee: number,
    memo: string | null,
    offlineUrl: string | null,
    payeeFioAddress: string,
    payeeTokenPublicAddress: string,
    payerFioAddress: string,
    payerFioPublicKey: string,
    technologyProviderId: string,
    tokenCode: string,
  }) {
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
    this.encryptPrivateKey = encryptPrivateKey

    if (technologyProviderId) {
      this.technologyProviderId = technologyProviderId
    } else {
      this.technologyProviderId = ''
    }
  }

  public getData(): any {
    const actor = this.getActor()
    const cipherContent = this.getCipherContent('new_funds_content', this.content, this.encryptPrivateKey || this.privateKey, this.payerFioPublicKey)
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
