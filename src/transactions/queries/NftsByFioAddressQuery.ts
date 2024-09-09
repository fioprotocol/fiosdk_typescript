import {EndPoint, NftsResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type NftsByFioAddressQueryProps = {
    fioAddress: string
    limit?: number
    offset?: number,
}

export type NftsByFioAddressQueryData = {
    fio_address: string
    limit?: number
    offset?: number,
}

export class NftsByFioAddressQuery extends Query<NftsByFioAddressQueryData, NftsResponse> {
    public ENDPOINT = `chain/${EndPoint.getNftsFioAddress}` as const

    constructor(config: RequestConfig, public props: NftsByFioAddressQueryProps) {
        super(config)
    }

    public getData = () => ({
        fio_address: this.props.fioAddress,
        limit: this.props.limit,
        offset: this.props.offset,
    })
}
