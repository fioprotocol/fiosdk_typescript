import {AvailabilityCheckResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type AvailabilityCheckQueryProps = {
    fioName: string;
}

export type AvailabilityCheckQueryData = {
    fio_name: string,
}

export class AvailabilityCheckQuery extends Query<AvailabilityCheckQueryData, AvailabilityCheckResponse> {
    public ENDPOINT = 'chain/avail_check'

    constructor(config: RequestConfig, public props: AvailabilityCheckQueryProps) {
        super(config)
    }

    public getData = () => ({fio_name: this.props.fioName})
}
