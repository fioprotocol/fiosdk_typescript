import {FioPermission} from '../types/FioPermission'

export type PermissionsResponse = {
    requests: FioPermission[]
    more: number,
}
