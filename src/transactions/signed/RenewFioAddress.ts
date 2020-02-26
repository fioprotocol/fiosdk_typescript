import { SignedTransaction } from './SignedTransaction'
import { Constants } from '../../utils/constants'
import { validationRules } from '../../utils/validation'

export class RenewFioAddress extends SignedTransaction {

  ENDPOINT: string = 'chain/renew_fio_address'
  ACTION: string = 'renewaddress'
  ACCOUNT: string = Constants.defaultAccount
  fioAddress: string
  maxFee: number
  technologyProviderId: String

  constructor(fioAddress: string, maxFee: number, technologyProviderId: string = '') {
    super()
    this.fioAddress = fioAddress
    this.maxFee = maxFee
    this.technologyProviderId = technologyProviderId

    this.validationData = { fioAddress: fioAddress, tpid: technologyProviderId || null }
    this.validationRules = validationRules.renewFioAddress
  }

  getData(): any {
    let actor = this.getActor()
    let data = {
      fio_address: this.fioAddress,
      max_fee: this.maxFee,
      tpid: this.technologyProviderId,
      actor: actor
    }
    return data
  }

}
