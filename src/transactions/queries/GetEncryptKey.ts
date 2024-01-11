import { GetEncryptKeyResponse } from '../../entities/GetEncryptKeyResponse'
import { Query } from './Query'

export class GetEncryptKey extends Query<GetEncryptKeyResponse> {
  public ENDPOINT: string = 'chain/get_encrypt_key'
  public fioAddress: string

  constructor(fioAddress: string) {
    super()
    this.fioAddress = fioAddress
  }

  public getData() {
    return { fio_address: this.fioAddress }
  }
}
