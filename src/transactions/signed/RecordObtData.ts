import { validationRules } from '../../utils/validation'
import { SignedTransaction } from './SignedTransaction'

export type RecordObtDataOptions = {
  amount: number,
  chainCode: string,
  encryptPrivateKey: string | null,
  fioRequestId: number | null,
  hash: string | null,
  maxFee: number,
  memo: string | null,
  obtId: string,
  offLineUrl: string | null,
  payeeFioAddress: string,
  payeeFioPublicKey: string,
  payeeTokenPublicAddress: string,
  payerFioAddress: string,
  payerTokenPublicAddress: string,
  status: string,
  technologyProviderId: string | null,
  tokenCode: string,
}

export class RecordObtData extends SignedTransaction {

  public ENDPOINT: string = 'chain/record_obt_data'
  public ACTION: string = 'recordobt'
  public ACCOUNT: string = 'fio.reqobt'

  public payerFioAddress: string
  public payeeFioPublicKey: string
  public payeeFioAddress: string
  public fioRequestId: number | null = null
  public maxFee: number
  public technologyProviderId: string = ''
  public payerPublicAddress: string
  public payeePublicAddress: string
  public encryptPrivateKey: string | null

  public defaultStatus: string = 'sent_to_blockchain'

  public content: any

  constructor({
    amount,
    chainCode,
    encryptPrivateKey = null,
    fioRequestId = null,
    hash = null,
    maxFee,
    memo = null,
    obtId,
    offLineUrl = null,
    payeeFioAddress,
    payeeFioPublicKey,
    payeePublicAddress,
    payerFioAddress,
    payerPublicAddress,
    status,
    technologyProviderId = '',
    tokenCode,
  }: {
    amount: number,
    chainCode: string,
    encryptPrivateKey: string | null,
    fioRequestId: number | null,
    hash: string | null,
    maxFee: number,
    memo: string | null,
    obtId: string,
    offLineUrl: string | null,
    payeeFioAddress: string,
    payeeFioPublicKey: string,
    payeePublicAddress: string,
    payerFioAddress: string,
    payerPublicAddress: string,
    status: string,
    technologyProviderId: string,
    tokenCode: string,
  }) {
    super()
    this.fioRequestId = fioRequestId
    this.payerFioAddress = payerFioAddress
    this.payeeFioPublicKey = payeeFioPublicKey
    this.payeeFioAddress = payeeFioAddress
    this.payerPublicAddress = payerPublicAddress
    this.payeePublicAddress = payeePublicAddress
    this.encryptPrivateKey = encryptPrivateKey
    if (technologyProviderId) {
      this.technologyProviderId = technologyProviderId
    } else {
      this.technologyProviderId = ''
    }
    this.maxFee = maxFee
    this.content = {
      payer_public_address: this.payerPublicAddress,
      payee_public_address: this.payeePublicAddress,
      amount: `${amount}`,
      chain_code: chainCode,
      token_code: tokenCode,
      status: status || this.defaultStatus,
      obt_id: obtId,
      memo,
      hash,
      offline_url: offLineUrl,
    }

    this.validationData = { payerFioAddress, payeeFioAddress, tpid: technologyProviderId || null, tokenCode }
    this.validationRules = validationRules.recordObtData

  }

  public getData(): any {
    const actor = this.getActor()
    const cipherContent = this.getCipherContent('record_obt_data_content', this.content, this.encryptPrivateKey || this.privateKey, this.payeeFioPublicKey)
    const data = {
      payer_fio_address: this.payerFioAddress,
      payee_fio_address: this.payeeFioAddress,
      content: cipherContent,
      fio_request_id: this.fioRequestId || '',
      max_fee: this.maxFee,
      actor,
      tpid: this.technologyProviderId,
    }
    return data
  }

}
