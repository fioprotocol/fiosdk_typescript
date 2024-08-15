import {PermissionsResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type GrantorPermissionsQueryProps = {
    grantorAccount: string
    limit?: number
    offset?: number,
}

export type GrantorPermissionsQueryData = {
    grantor_account: string
    limit?: number
    offset?: number,
}

export class GrantorPermissionsQuery extends Query<GrantorPermissionsQueryData, PermissionsResponse> {
    public ENDPOINT = 'chain/get_grantor_permissions'

    constructor(config: RequestConfig, public props: GrantorPermissionsQueryProps) {
        super(config)
    }

    public getData = () => ({
        grantor_account: this.props.grantorAccount,
        limit: this.props.limit,
        offset: this.props.offset,
    })
}
