import { Constants } from '../../utils/constants'
import { validationRules } from '../../utils/validation'
import { SignedTransaction } from './SignedTransaction'

export class SetFioDomainVisibility extends SignedTransaction {

  public ENDPOINT: string = 'chain/set_fio_domain_public'
  public ACTION: string = 'setdomainpub'
  public ACCOUNT: string = Constants.defaultAccount
  public fioDomain: string
  public isPublic: number
  public maxFee: number
  public technologyProviderId: string

  constructor(fioDomain: string, isPublic: boolean, maxFee: number, technologyProviderId: string = '') {
    super()
    this.fioDomain = fioDomain
    this.isPublic = isPublic ? 1 : 0
    this.maxFee = maxFee
    this.technologyProviderId = technologyProviderId
  }

  public getData(): any {
    this.validationData = { fioDomain: this.fioDomain, tpid: this.technologyProviderId || null }
    this.validationRules = validationRules.registerFioDomain
    const actor = this.getActor()
    const data = {
      fio_domain: this.fioDomain,
      is_public: this.isPublic,
      max_fee: this.maxFee,
      tpid: this.technologyProviderId,
      actor,
    }
    return data
  }

}
