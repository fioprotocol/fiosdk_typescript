import { SignedTransaction } from './SignedTransaction'
import { validationRules } from '../../utils/validation'
import { Constants } from '../../utils/constants'

export class SetFioDomainVisibility extends SignedTransaction {

  public ENDPOINT: string = 'chain/set_fio_domain_public'
  public ACTION: string = 'setdomainpub'
  public ACCOUNT: string = Constants.defaultAccount
  public fioDomain: string
  public isPublic: number
  public maxFee: number
  public walletFioAddress: string

  constructor(fioDomain: string, isPublic: boolean, maxFee: number, walletFioAddress: string = '') {
    super()
    this.fioDomain = fioDomain
    this.isPublic = isPublic ? 1 : 0
    this.maxFee = maxFee
    this.walletFioAddress = walletFioAddress
  }

  public getData(): any {
    this.validationData = { fioDomain: this.fioDomain, tpid: this.walletFioAddress }
    this.validationRules = validationRules.registerFioAddress
    const actor = this.getActor()
    const data = {
      fio_domain: this.fioDomain,
      is_public: this.isPublic,
      max_fee: this.maxFee,
      tpid: this.walletFioAddress,
      actor,
    }
    return data
  }

}
