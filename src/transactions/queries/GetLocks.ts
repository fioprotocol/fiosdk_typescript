import { Query } from './Query'
import { LocksResponse } from '../../entities/LocksResponse'

export class GetLocks extends Query<LocksResponse> {
  public ENDPOINT: string = 'chain/get_locks'
  public keyToUse: string

  constructor(fioPublicKey: string) {
    super()
    this.keyToUse = fioPublicKey
  }

  public getData() {
    return { fio_public_key: this.keyToUse }
  }

}
