import {EndPoint, FioAddressesResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type FioAddressesQueryProps = {
    fioPublicKey: string,
    limit?: number
    offset?: number,
}

export type FioAddressesQueryData = {
    fio_public_key: string
    limit?: number,
    offset?: number,
}

export class FioAddressesQuery extends Query<FioAddressesQueryData, FioAddressesResponse> {
    public ENDPOINT = `chain/${EndPoint.getFioAddresses}` as const

    constructor(config: RequestConfig, public props: FioAddressesQueryProps) {
        super(config)
    }

    public getData = () => ({
        fio_public_key: this.props.fioPublicKey,
        limit: this.props.limit,
        offset: this.props.offset,
    })
}
