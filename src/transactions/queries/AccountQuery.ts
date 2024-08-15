import {AccountResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type AccountQueryProps = {
    actor: string,
}

export type AccountQueryData = {
    account_name: string,
}

export class AccountQuery extends Query<AccountQueryData, AccountResponse> {
    public ENDPOINT = 'chain/get_account'

    constructor(config: RequestConfig, public props: AccountQueryProps) {
        super(config)
    }

    public getData = () => ({account_name: this.props.actor})
}
