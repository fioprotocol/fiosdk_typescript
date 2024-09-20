import {EndPoint, FioOracleFeesResponse} from '../../entities'
import {Query} from './Query'

export class OracleFeesQuery extends Query<void, FioOracleFeesResponse> {
    public ENDPOINT = `chain/${EndPoint.getOracleFees}` as const

    public getData() {
        return
    }
}