import { FioFeeResponse } from '../../entities/FioFeeResponse'
import { Constants } from '../../utils/constants'
import { Query } from './Query'

export class GetFee extends Query<FioFeeResponse> {
  public ENDPOINT: string = 'chain/get_fee'
  public endPoint: string
  public fioAddress: string

  constructor(endPoint: string, fioAddress: string = '') {
    super()
    this.endPoint = endPoint
    this.fioAddress = fioAddress

    if (Constants.feeNoAddressOperation.findIndex((element) => element === endPoint) > -1 && fioAddress.length > 0) {
      throw new Error('End point ' + endPoint + ' should not have any fio address, when requesting fee')
    }
  }

  public getData() {
    const data = { end_point: this.endPoint }
    if (this.fioAddress) { data.fio_address = this.fioAddress }
    return data
  }
}
