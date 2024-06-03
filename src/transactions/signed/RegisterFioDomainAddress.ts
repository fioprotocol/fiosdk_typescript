import { Constants } from '../../utils/constants'
import { validationRules } from '../../utils/validation'
import { SignedTransaction } from './SignedTransaction'

export class RegisterFioDomainAddress extends SignedTransaction {

  public ENDPOINT: string = 'chain/register_fio_domain_address'
  public ACTION: string = 'regdomadd'
  public ACCOUNT: string = Constants.defaultAccount

  constructor(
      public fioAddress: string,
      public maxFee: number,
      public isPublic: boolean = false,
      public ownerPublicKey: string | null = null,
      public technologyProviderId: string | null = null
  ) {
    super()
    this.validationData = { fioAddress, tpid: technologyProviderId }
    this.validationRules = validationRules.registerFioDomainAddress
  }

  public getData(): any {
    const actor = this.getActor()
    return {
      fio_address: this.fioAddress,
      is_public: this.isPublic ? 1 : 0,
      owner_fio_public_key: this.ownerPublicKey || this.publicKey,
      max_fee: this.maxFee,
      tpid: this.technologyProviderId,
      actor,
    }
  }

}
