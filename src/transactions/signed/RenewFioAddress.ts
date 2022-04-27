import { Constants } from '../../utils/constants'
import { validationRules } from '../../utils/validation'
import { SignedTransaction } from './SignedTransaction'

export class RenewFioAddress extends SignedTransaction {

  public ENDPOINT: string = 'chain/renew_fio_address'
  public ACTION: string = 'renewaddress'
  public ACCOUNT: string = Constants.defaultAccount
  public fioAddress: string
  public maxFee: number
  public technologyProviderId: String

  constructor(fioAddress: string, maxFee: number, technologyProviderId: string = '') {
    super()
    this.fioAddress = fioAddress
    this.maxFee = maxFee
    this.technologyProviderId = technologyProviderId

    this.validationData = { fioAddress, tpid: technologyProviderId || null }
    this.validationRules = validationRules.renewFioAddress
  }

  public getData(): any {
    const actor = this.getActor()
    const data = {
      fio_address: this.fioAddress,
      max_fee: this.maxFee,
      tpid: this.technologyProviderId,
      actor,
    }
    return data
  }

}
