import {FioNamesResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type FioNamesQueryProps = {
    fioPublicKey: string,
}

export type FioNamesQueryData = {
    fio_public_key: string,
}

export class FioNamesQuery extends Query<FioNamesQueryData, FioNamesResponse> {
    public ENDPOINT = 'chain/get_fio_names'

    constructor(config: RequestConfig, public props: FioNamesQueryProps) {
        super(config)
    }

    public getData = () => ({fio_public_key: this.props.fioPublicKey})
}
