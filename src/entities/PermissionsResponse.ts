import { FioPermission } from './FioPermission'

export interface PermissionsResponse {
  requests: FioPermission[],
  more: number
}
