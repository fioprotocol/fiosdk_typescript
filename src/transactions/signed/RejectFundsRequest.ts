import { SignedTransaction } from './SignedTransaction'
import { validationRules } from '../../utils/validation'

export class RejectFundsRequest extends SignedTransaction {

  ENDPOINT: string = 'chain/reject_funds_request'
  ACTION: string = 'rejectfndreq'
  ACCOUNT: string = 'fio.reqobt'
  fioreqid: number
  maxFee: number
  walletFioAddress: string

  constructor(fioreqid: number, maxFee: number, walletFioAddress: string = '') {
    super()
    this.fioreqid = fioreqid
    this.maxFee = maxFee
    this.walletFioAddress = walletFioAddress

    this.validationData = { tpid: walletFioAddress }
    this.validationRules = validationRules.rejectFunds
  }

  getData(): any {
    let actor = this.getActor()
    let data = {
      fio_request_id: this.fioreqid,
      max_fee: this.maxFee,
      tpid: this.walletFioAddress,
      actor: actor
    }
    return data
  }

}
