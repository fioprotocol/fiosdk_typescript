import {GetAccountPubKeyResponse, EndPoint} from '../../entities'
import { RequestConfig } from '../Transactions'
import { Query } from './Query'

export type AccountPubKeyQueryProps = {
    account: string,
}

export type AccountPubKeyQueryData = {
    account: string,
}

export class GetAccountPubKey extends Query<AccountPubKeyQueryData, GetAccountPubKeyResponse> {
    public ENDPOINT = `chain/${EndPoint.getAccountFioPublicKey}` as const

    constructor(config: RequestConfig, public props: AccountPubKeyQueryProps) {
        super(config)
    }

    public getData = () => ({account: this.props.account})
}
