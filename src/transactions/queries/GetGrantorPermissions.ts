import { PermissionsResponse } from '../../entities/PermissionsResponse'
import { Query } from './Query'

export class GetGrantorPermissions extends Query<PermissionsResponse> {
  public ENDPOINT: string = 'chain/get_grantor_permissions'
  public accountToUse: string
  public limit: number | null
  public offset: number | null

  constructor(account: string, limit?: number, offset?: number ) {
    super()
    this.accountToUse = account
    this.limit = limit || null
    this.offset = offset || null
  }

  public getData() {
    return { grantor_account: this.accountToUse,
      limit: this.limit || null,
      offset: this.offset || null }
  }

}
