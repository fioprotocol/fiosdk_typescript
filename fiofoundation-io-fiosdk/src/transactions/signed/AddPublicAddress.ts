import { SignedTransaction } from './SignedTransaction'
import { validationRules } from '../../utils/validation'

export class AddPublicAddress extends SignedTransaction {
  public ENDPOINT: string = 'chain/add_pub_address'
  public ACTION: string = 'addaddress'
  public ACCOUNT: string = 'fio.system'
  public fioAddress: string
  public tokenCode: string
  public publicAddress: string
  public maxFee: number
  public walletFioAddress: string

  constructor(fioAddress: string, tokenCode: string, publicAddress: string, maxFee: number, walletFioAddress: string = '') {
    super()
    this.fioAddress = fioAddress
    this.tokenCode = tokenCode
    this.publicAddress = publicAddress
    this.maxFee = maxFee
    this.walletFioAddress = walletFioAddress

    this.validationData = { fioAddress, tokenCode, publicAddress }
    this.validationRules = validationRules.addPublicAddressRules
  }

  public getData(): any {
    const actor = this.getActor()
    const data = {
      fio_address: this.fioAddress,
      token_code: this.tokenCode,
      public_address: this.publicAddress,
      actor,
      tpid: this.walletFioAddress,
      max_fee: this.maxFee,
    }
    return data
  }
}
