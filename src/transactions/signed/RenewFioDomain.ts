import { Constants } from '../../utils/constants'
import { validationRules } from '../../utils/validation'
import { SignedTransaction } from './SignedTransaction'

export class RenewFioDomain extends SignedTransaction {

  public ENDPOINT: string = 'chain/renew_fio_domain'
  public ACTION: string = 'renewdomain'
  public ACCOUNT: string = Constants.defaultAccount
  public fioDomain: string
  public maxFee: number
  public technologyProviderId: string

  constructor(fioDomain: string, maxFee: number, technologyProviderId: string = '') {
    super()
    this.fioDomain = fioDomain
    this.maxFee = maxFee
    this.technologyProviderId = technologyProviderId

    this.validationData = { fioDomain, tpid: technologyProviderId || null }
    this.validationRules = validationRules.renewFioDomain
  }

  public getData(): any {
    const actor = this.getActor()
    const data = {
      fio_domain: this.fioDomain,
      max_fee: this.maxFee,
      tpid: this.technologyProviderId,
      actor,
    }
    return data
  }

}
