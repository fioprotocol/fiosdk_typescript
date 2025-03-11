import {EndPoint, PermissionsResponse} from '../../entities'
import {RequestConfig} from '../Transactions'
import {Query} from './Query'

export type GranteePermissionsQueryProps = {
    granteeAccount: string
    limit?: number
    offset?: number,
}

export type GranteePermissionsQueryData = {
    grantee_account: string
    limit?: number
    offset?: number,
}

export class GetGranteePermissions extends Query<GranteePermissionsQueryData, PermissionsResponse> {
    public ENDPOINT = `chain/${EndPoint.getGranteePermissions}` as const

    constructor(config: RequestConfig, public props: GranteePermissionsQueryProps) {
        super(config)
    }

    public getData = () => ({
        grantee_account: this.props.granteeAccount,
        limit: this.props.limit,
        offset: this.props.offset,
    })

}
