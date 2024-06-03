import { Constants } from '../../utils/constants'
import { validationRules } from '../../utils/validation'
import { SignedTransaction } from './SignedTransaction'

export type RegisterFioDomainAddressOptions = {
  fioAddress: string;
  maxFee: number;
  isPublic?: boolean;
  ownerPublicKey?: string | null;
  technologyProviderId?: string | null;
}

export class RegisterFioDomainAddress extends SignedTransaction {

  public ENDPOINT: string = 'chain/register_fio_domain_address'
  public ACTION: string = 'regdomadd'
  public ACCOUNT: string = Constants.defaultAccount

  constructor(
      public options: RegisterFioDomainAddressOptions,
  ) {
    super()
    this.validationData = { fioAddress: options.fioAddress, tpid: options.technologyProviderId }
    this.validationRules = validationRules.registerFioDomainAddress
  }

  public getData(): any {
    const actor = this.getActor()
    return {
      fio_address: this.options.fioAddress,
      max_fee: this.options.maxFee,
      is_public: this.options.isPublic ? 1 : 0,
      owner_fio_public_key: this.options.ownerPublicKey || this.publicKey || null,
      tpid: this.options.technologyProviderId || null,
      actor,
    }
  }

}
