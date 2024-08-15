import {GetObtDataRecord} from '../types/GetObtDataRecord'

export type GetObtDataResponse = {
    obt_data_records: GetObtDataRecord[]
    more: number,
}
