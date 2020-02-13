import { Query } from './Query'
import { PublicAddressResponse } from '../../entities/PublicAddressResponse'


export class GetPublicAddress extends Query<PublicAddressResponse> {
  ENDPOINT: string = 'chain/get_pub_address'
  fioAddress: string
  chainCode: string
  tokenCode: string

  constructor(fioAddress: string, chainCode: string, tokenCode: string) {
    super()
    this.fioAddress = fioAddress
    this.chainCode = chainCode
    this.tokenCode = tokenCode
  }

  getData() {
    return {
      fio_address: this.fioAddress,
      chain_code: this.chainCode,
      token_code: this.tokenCode
    }
  }
}
