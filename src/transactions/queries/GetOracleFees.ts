import { FioOracleFeesResponse} from '../../entities/FioFeeResponse'
import { Query } from './Query'

export class GetOracleFees extends Query<FioOracleFeesResponse> {
  public ENDPOINT: string = 'chain/get_oracle_fees'

  constructor() {
    super()
  }

  public getData() {
    return
  }
}
