import { PublicAddressResponse } from '../../entities/PublicAddressResponse'
import { Query } from './Query'

export class GetPublicAddress extends Query<PublicAddressResponse> {
  public ENDPOINT: string = 'chain/get_pub_address'
  public fioAddress: string
  public chainCode: string
  public tokenCode: string

  constructor(fioAddress: string, chainCode: string, tokenCode: string) {
    super()
    this.fioAddress = fioAddress
    this.chainCode = chainCode
    this.tokenCode = tokenCode
  }

  public getData() {
    return {
      fio_address: this.fioAddress,
      chain_code: this.chainCode,
      token_code: this.tokenCode,
    }
  }
}
