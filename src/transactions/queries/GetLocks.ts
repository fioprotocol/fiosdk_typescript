import { LocksResponse } from '../../entities/LocksResponse'
import { Query } from './Query'

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
