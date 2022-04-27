
import { validationRules } from '../../utils/validation'
import { SignedTransaction } from './SignedTransaction'

export class CancelFundsRequest extends SignedTransaction {
  public ENDPOINT: string = 'chain/cancel_funds_request'
  public ACTION: string = 'cancelfndreq'
  public ACCOUNT: string = 'fio.reqobt'

  public fioRequestId: number
  public maxFee: number
  public technologyProviderId: string

  constructor(fioRequestId: number,  maxFee: number, technologyProviderId: string = '') {
    super()
    this.fioRequestId = fioRequestId
    this.maxFee = maxFee
    this.technologyProviderId = technologyProviderId

    this.validationData = { tpid: technologyProviderId || null }
    this.validationRules = validationRules.cancelFundsRequestRules
  }

  public getData(): any {
    const actor = this.getActor()
    const data = {
      fio_request_id: this.fioRequestId,
      actor,
      tpid: this.technologyProviderId,
      max_fee: this.maxFee,
    }
    return data
  }
}
