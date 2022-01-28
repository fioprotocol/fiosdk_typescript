import { validationRules } from '../../utils/validation'
import { SignedTransaction } from './SignedTransaction'

export class RejectFundsRequest extends SignedTransaction {

  public ENDPOINT: string = 'chain/reject_funds_request'
  public ACTION: string = 'rejectfndreq'
  public ACCOUNT: string = 'fio.reqobt'
  public fioreqid: number
  public maxFee: number
  public technologyProviderId: string

  constructor(fioreqid: number, maxFee: number, technologyProviderId: string = '') {
    super()
    this.fioreqid = fioreqid
    this.maxFee = maxFee
    this.technologyProviderId = technologyProviderId

    this.validationData = { tpid: technologyProviderId || null }
    this.validationRules = validationRules.rejectFunds
  }

  public getData(): any {
    const actor = this.getActor()
    const data = {
      fio_request_id: this.fioreqid,
      max_fee: this.maxFee,
      tpid: this.technologyProviderId,
      actor,
    }
    return data
  }

}
