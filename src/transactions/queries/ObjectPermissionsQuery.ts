import {PermissionsResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type ObjectPermissionsQueryProps = {
    permissionName: string,
    objectName: string,
    limit?: number,
    offset?: number,
}

export type ObjectPermissionsQueryData = {
    permission_name: string
    object_name: string
    limit?: number
    offset?: number,
}

export class ObjectPermissionsQuery extends Query<ObjectPermissionsQueryData, PermissionsResponse> {
    public ENDPOINT = 'chain/get_object_permissions'

    constructor(config: RequestConfig, public props: ObjectPermissionsQueryProps) {
        super(config)
    }

    public getData = () => ({
        limit: this.props.limit,
        object_name: this.props.objectName,
        offset: this.props.offset,
        permission_name: this.props.permissionName,
    })
}
