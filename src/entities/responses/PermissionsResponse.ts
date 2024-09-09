import {FioPermission} from '../types/FioPermission'

export type PermissionsResponse = {
    permissions: FioPermission[]
    more: number,
}
