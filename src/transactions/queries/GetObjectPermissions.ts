import { PermissionsResponse } from '../../entities/PermissionsResponse'
import { Query } from './Query'

export class GetObjectPermissions extends Query<PermissionsResponse> {
  public ENDPOINT: string = 'chain/get_object_permissions'
  public permissionNameToUse: string
  public objectNameToUse: string
  public limit: number | null
  public offset: number | null

  constructor(permissionName: string, objectName: string, limit?: number, offset?: number ) {
    super()
    this.permissionNameToUse = permissionName
    this.objectNameToUse = objectName
    this.limit = limit || null
    this.offset = offset || null
  }

  public getData() {
    return { permission_name: this.permissionNameToUse,
      object_name: this.objectNameToUse,
      limit: this.limit || null,
      offset: this.offset || null }
  }

}
