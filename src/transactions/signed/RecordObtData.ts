import { validationRules } from '../../utils/validation'
import { SignedTransaction } from './SignedTransaction'

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

  public defaultStatus: string = 'sent_to_blockchain'

  public content: any

  constructor(
    fioRequestId: number | null,
    payerFioAddress: string,
    payeeFioAddress: string,
    payerPublicAddress: string,
    payeePublicAddress: string,
    amount: number,
    chainCode: string,
    tokenCode: string,
    obtID: string,
    maxFee: number,
    status: string,
    technologyProviderId: string = '',
    payeeFioPublicKey: string,
    memo: string | null = null,
    hash: string | null = null,
    offLineUrl: string | null = null) {
    super()
    this.fioRequestId = fioRequestId
    this.payerFioAddress = payerFioAddress
    this.payeeFioPublicKey = payeeFioPublicKey
    this.payeeFioAddress = payeeFioAddress
    this.payerPublicAddress = payerPublicAddress
    this.payeePublicAddress = payeePublicAddress
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
      obt_id: obtID,
      memo,
      hash,
      offline_url: offLineUrl,
    }

    this.validationData = { payerFioAddress, payeeFioAddress, tpid: technologyProviderId || null, tokenCode }
    this.validationRules = validationRules.recordObtData

  }

  public getData(): any {
    const actor = this.getActor()
    const cipherContent = this.getCipherContent('record_obt_data_content', this.content, this.privateKey, this.payeeFioPublicKey)
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
