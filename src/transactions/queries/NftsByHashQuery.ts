import {NftsResponse} from '../../entities'
import {RequestConfig} from '../Request'
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

export class NftsByHashQuery extends Query<NftsByHashQueryData, NftsResponse> {
    public ENDPOINT = 'chain/get_nfts_hash'

    constructor(config: RequestConfig, public props: NftsByHashQueryProps) {
        super(config)
    }

    public getData = () => ({
        hash: this.props.hash,
        limit: this.props.limit,
        offset: this.props.offset,
    })
}
