import {EndPoint, PermissionsResponse} from '../../entities'
import {RequestConfig} from '../Transactions'
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

export class GetGrantorPermissions extends Query<GrantorPermissionsQueryData, PermissionsResponse> {
    public ENDPOINT = `chain/${EndPoint.getGrantorPermissions}` as const

    constructor(config: RequestConfig, public props: GrantorPermissionsQueryProps) {
        super(config)
    }

    public getData = () => ({
        grantor_account: this.props.grantorAccount,
        limit: this.props.limit,
        offset: this.props.offset,
    })
}
