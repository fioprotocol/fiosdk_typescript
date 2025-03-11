import {AvailabilityResponse, EndPoint} from '../../entities'
import {RequestConfig} from '../Transactions'
import {Query} from './Query'

export type AvailabilityCheckQueryProps = {
    fioName: string;
}

export type AvailabilityCheckQueryData = {
    fio_name: string,
}

export class AvailabilityCheckQuery extends Query<AvailabilityCheckQueryData, AvailabilityResponse> {
    public ENDPOINT = `chain/${EndPoint.availCheck}` as const

    constructor(config: RequestConfig, public props: AvailabilityCheckQueryProps) {
        super(config)
    }

    public getData = () => ({fio_name: this.props.fioName})
}
