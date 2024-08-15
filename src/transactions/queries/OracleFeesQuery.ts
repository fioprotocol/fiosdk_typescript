import {FioOracleFeesResponse} from '../../entities'
import {Query} from './Query'

export class OracleFeesQuery extends Query<void, FioOracleFeesResponse> {
    public ENDPOINT = 'chain/get_oracle_fees'

    public getData() {
        return
    }
}
