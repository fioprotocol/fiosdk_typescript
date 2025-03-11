import {EndPoint, FioNamesResponse} from '../../entities'
import {RequestConfig} from '../Transactions'
import {Query} from './Query'

export type FioNamesQueryProps = {
    fioPublicKey: string,
}

export type FioNamesQueryData = {
    fio_public_key: string,
}

export class GetNames extends Query<FioNamesQueryData, FioNamesResponse> {
    public ENDPOINT = `chain/${EndPoint.getFioNames}` as const

    constructor(config: RequestConfig, public props: FioNamesQueryProps) {
        super(config)
    }

    public getData = () => ({fio_public_key: this.props.fioPublicKey})
}
