import {FioDomainsResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type FioDomainsQueryProps = {
    fioPublicKey: string
    limit?: number
    offset?: number,
}

export type FioDomainsQueryData = {
    fio_public_key: string
    limit?: number
    offset?: number,
}

export class FioDomainsQuery extends Query<FioDomainsQueryData, FioDomainsResponse> {
    public ENDPOINT = 'chain/get_fio_domains'

    constructor(config: RequestConfig, public props: FioDomainsQueryProps) {
        super(config)
    }

    public getData = () => ({
        fio_public_key: this.props.fioPublicKey,
        limit: this.props.limit,
        offset: this.props.offset,
    })
}
