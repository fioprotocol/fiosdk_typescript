import {AccountResponse, EndPoint} from '../../entities'
import {RequestConfig} from '../Transactions'
import {Query} from './Query'

export type AccountQueryProps = {
    actor: string,
}

export type AccountQueryData = {
    account_name: string,
}

export class GetAccount extends Query<AccountQueryData, AccountResponse> {
    public ENDPOINT = `chain/${EndPoint.getAccount}` as const

    constructor(config: RequestConfig, public props: AccountQueryProps) {
        super(config)
    }

    public getData = () => ({account_name: this.props.actor})
}
