import {AbiResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type AbiQueryProps = {
    accountName: string;
}

export type AbiQueryData = {
    account_name: string;
}

export class AbiQuery extends Query<AbiQueryData, AbiResponse> {
    public ENDPOINT = 'chain/get_raw_abi'

    constructor(config: RequestConfig, public props: AbiQueryProps) {
        super(config)
    }

    public getData = () => ({
        account_name: this.props.accountName,
    })
}
