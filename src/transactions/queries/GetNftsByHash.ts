import {EndPoint, NftsResponse} from '../../entities'
import {RequestConfig} from '../Transactions'
import {Query} from './Query'

export type NftsByHashQueryProps = {
    hash: string
    limit?: number
    offset?: number,
}

export type NftsByHashQueryData = {
    hash: string
    limit?: number
    offset?: number,
}

export class GetNftsByHash extends Query<NftsByHashQueryData, NftsResponse> {
    public ENDPOINT = `chain/${EndPoint.getNftsHash}` as const

    constructor(config: RequestConfig, public props: NftsByHashQueryProps) {
        super(config)
    }

    public getData = () => ({
        hash: this.props.hash,
        limit: this.props.limit,
        offset: this.props.offset,
    })
}
