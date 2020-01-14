import { Query } from './Query'
import { PublicAddressResponse } from '../../entities/PublicAddressResponse'


export class GetPublicAddress extends Query<PublicAddressResponse> {
  ENDPOINT: string = 'chain/get_pub_address'
  fioAddress: string
  tokenCode: string

  constructor(fioAddress: string, tokenCode: string) {
    super()
    this.fioAddress = fioAddress
    this.tokenCode = tokenCode
  }

  getData() {
    return {
      fio_address: this.fioAddress,
      token_code: this.tokenCode
    }
  }
}