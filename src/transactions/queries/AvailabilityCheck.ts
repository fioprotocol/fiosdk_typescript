import { AvailabilityResponse } from '../../entities/AvailabilityResponse'
import { Query } from './Query'

export class AvailabilityCheck extends Query<AvailabilityResponse> {
  public ENDPOINT: string = 'chain/avail_check'
  public fioName: string

  constructor(fioName: string) {
    super()
    this.fioName = fioName
  }

  public getData() {
    return { fio_name: this.fioName }
  }
}
