import {PublicAddressesResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type PublicAddressesQueryProps = {
    fioAddress: string
    limit?: number
    offset?: number,
}

export type PublicAddressesQueryData = {
    fio_address: string
    limit?: number
    offset?: number,
}

export class PublicAddressesQuery extends Query<PublicAddressesQueryData, PublicAddressesResponse> {
    public ENDPOINT = 'chain/get_pub_addresses'

    constructor(config: RequestConfig, public props: PublicAddressesQueryProps) {
        super(config)
    }

    public getData = () => ({
        fio_address: this.props.fioAddress,
        limit: this.props.limit,
        offset: this.props.offset,
    })
}
