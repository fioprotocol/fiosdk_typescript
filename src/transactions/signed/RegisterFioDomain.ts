import { Constants } from '../../utils/constants'
import { validationRules } from '../../utils/validation'
import { SignedTransaction } from './SignedTransaction'

export class RegisterFioDomain extends SignedTransaction {

  public ENDPOINT: string = 'chain/register_fio_domain'
  public ACTION: string = 'regdomain'
  public ACCOUNT: string = Constants.defaultAccount
  public fioDomain: string
  public ownerPublicKey: string
  public maxFee: number
  public technologyProviderId: string

  constructor(fioDomain: string, ownerPublicKey: string | null, maxFee: number, technologyProviderId: string = '') {
    super()
    this.fioDomain = fioDomain
    this.ownerPublicKey = ownerPublicKey || ''
    this.maxFee = maxFee
    this.technologyProviderId = technologyProviderId
    this.validationData = { fioDomain, tpid: technologyProviderId || null }
    this.validationRules = validationRules.registerFioDomain
  }

  public getData(): any {
    const actor = this.getActor()
    const data = {
      fio_domain: this.fioDomain,
      owner_fio_public_key: this.ownerPublicKey || this.publicKey,
      max_fee: this.maxFee,
      tpid: this.technologyProviderId,
      actor,
    }
    return data
  }

}
