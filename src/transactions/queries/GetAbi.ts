import {AbiResponse, EndPoint} from '../../entities'
import {RequestConfig} from '../Transactions'
import {Query} from './Query'

export type AbiQueryProps = {
    accountName: string;
}

export type AbiQueryData = {
    account_name: string;
}

export class GetAbi extends Query<AbiQueryData, AbiResponse> {
    public ENDPOINT = `chain/${EndPoint.getRawAbi}` as const

    constructor(config: RequestConfig, public props: AbiQueryProps) {
        super(config)
    }

    public getData = () => ({
        account_name: this.props.accountName,
    })
}
