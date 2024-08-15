import {AccountPubKeyResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type AccountPubKeyQueryProps = {
    account: string,
}

export type AccountPubKeyQueryData = {
    account: string,
}

export class AccountPubKeyQuery extends Query<AccountPubKeyQueryData, AccountPubKeyResponse> {
    public ENDPOINT = 'chain/get_account_fio_public_key'

    constructor(config: RequestConfig, public props: AccountPubKeyQueryProps) {
        super(config)
    }

    public getData = () => ({account: this.props.account})
}
