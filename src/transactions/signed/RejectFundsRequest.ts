import { SignedTransaction } from './SignedTransaction'
import { validationRules } from '../../utils/validation'

export class RejectFundsRequest extends SignedTransaction {

  ENDPOINT: string = 'chain/reject_funds_request'
  ACTION: string = 'rejectfndreq'
  ACCOUNT: string = 'fio.reqobt'
  fioreqid: number
  maxFee: number
  technologyProviderId: string

  constructor(fioreqid: number, maxFee: number, technologyProviderId: string = '') {
    super()
    this.fioreqid = fioreqid
    this.maxFee = maxFee
    this.technologyProviderId = technologyProviderId

    this.validationData = { tpid: technologyProviderId || null }
    this.validationRules = validationRules.rejectFunds
  }

  getData(): any {
    let actor = this.getActor()
    let data = {
      fio_request_id: this.fioreqid,
      max_fee: this.maxFee,
      tpid: this.technologyProviderId,
      actor: actor
    }
    return data
  }

}
