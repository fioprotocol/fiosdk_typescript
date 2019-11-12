import { FioNamesResponse } from '../../entities/FioNamesResponse'
import { Query } from './Query'

export class GetNames extends Query<FioNamesResponse> {
  public ENDPOINT: string = 'chain/get_fio_names'
  public fioPublicKey: string

  constructor(fioPublicKey: string) {
    super()
    this.fioPublicKey = fioPublicKey
  }

  public getData() {
    return { fio_public_key: this.fioPublicKey }
  }
}
