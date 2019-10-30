import { SignedTransaction } from './SignedTransaction'
import { validationRules } from '../../utils/validation'
import { Constants } from '../../utils/constants'

export class RegisterFioAddress extends SignedTransaction {

  public ENDPOINT: string = 'chain/register_fio_address'
  public ACTION: string = 'regaddress'
  public ACCOUNT: string = Constants.defaultAccount
  public fioAddress: string
  public maxFee: number
  public walletFioAddress: string

  constructor(fioAddress: string, maxFee: number, walletFioAddress: string = '') {
    super()
    this.fioAddress = fioAddress
    this.maxFee = maxFee
    this.walletFioAddress = walletFioAddress

    this.validationData = { fioAddress: fioAddress, tpid: walletFioAddress }
    this.validationRules = validationRules.registerFioAddress
  }

  public getData(): any {
    const actor = this.getActor()
    const data = {
      fio_address: this.fioAddress,
      owner_fio_public_key: this.publicKey,
      max_fee: this.maxFee,
      tpid: this.walletFioAddress,
      actor,
    }
    return data
  }

}
