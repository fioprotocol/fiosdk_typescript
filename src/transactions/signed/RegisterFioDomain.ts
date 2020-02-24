import { SignedTransaction } from './SignedTransaction'
import { Constants } from '../../utils/constants'
import { validationRules } from '../../utils/validation'

export class RegisterFioDomain extends SignedTransaction {

  ENDPOINT: string = 'chain/register_fio_domain'
  ACTION: string = 'regdomain'
  ACCOUNT: string = Constants.defaultAccount
  fioDomain: string
  maxFee: number
  technologyProviderId: string

  constructor(fioDomain: string, maxFee: number, technologyProviderId: string = '') {
    super()
    this.fioDomain = fioDomain
    this.maxFee = maxFee
    this.technologyProviderId = technologyProviderId
    this.validationData = { fioDomain: fioDomain, tpid: technologyProviderId || null }
    this.validationRules = validationRules.registerFioDomain
  }

  getData(): any {
    let actor = this.getActor()
    let data = {
      fio_domain: this.fioDomain,
      owner_fio_public_key: this.publicKey,
      max_fee: this.maxFee,
      tpid: this.technologyProviderId,
      actor: actor
    }
    return data
  }

}
