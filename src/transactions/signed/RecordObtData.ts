import { SignedTransaction } from './SignedTransaction'
import { validationRules } from '../../utils/validation'

export class RecordObtData extends SignedTransaction {

  ENDPOINT: string = 'chain/record_obt_data'
  ACTION: string = 'recordobt'
  ACCOUNT: string = 'fio.reqobt'

  payerFIOAddress: string
  payerFioPublicKey: string
  payeeFIOAddress: string
  fioRequestId: string = ''
  maxFee: number
  walletFioAddress: string = ''
  payerPublicAddress: string
  payeePublicAddress: string

  content: any

  constructor(
    fioRequestId: string,
    payerFIOAddress: string,
    payeeFIOAddress: string,
    payerPublicAddress: string,
    payeePublicAddress: string,
    amount: number,
    tokenCode: string,
    obtID: string,
    maxFee: number,
    status: string,
    walletFioAddress: string = '',
    payerFioPublicKey: string,
    memo: string | null = null,
    hash: string | null = null,
    offLineUrl: string | null = null) {
    super()
    this.fioRequestId = fioRequestId
    this.payerFIOAddress = payerFIOAddress
    this.payerFioPublicKey = payerFioPublicKey
    this.payeeFIOAddress = payeeFIOAddress
    this.payerPublicAddress = payerPublicAddress
    this.payeePublicAddress = payeePublicAddress
    if (walletFioAddress) {
      this.walletFioAddress = walletFioAddress
    } else {
      this.walletFioAddress = ''
    }
    this.maxFee = maxFee
    this.content = {
      payer_public_address: this.payerPublicAddress,
      payee_public_address: this.payeePublicAddress,
      amount: `${amount}`,
      token_code: tokenCode,
      status: status,
      obt_id: obtID,
      memo: memo,
      hash: hash,
      offline_url: offLineUrl
    }

    this.validationData = { payerFIOAddress, payeeFIOAddress, tpid: walletFioAddress, tokenCode }
    this.validationRules = validationRules.recordObtData

  }

  getData(): any {
    let actor = this.getActor()
    const cipherContent = this.getCipherContent('record_send_content', this.content, this.privateKey, this.payerFioPublicKey)
    let data = {
      payer_fio_address: this.payerFIOAddress,
      payee_fio_address: this.payeeFIOAddress,
      content: cipherContent,
      fio_request_id: this.fioRequestId,
      max_fee: this.maxFee,
      actor: actor,
      tpid: this.walletFioAddress
    }
    return data
  }

}
