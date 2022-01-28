export class Autorization {
  public actor: string
  public permission: string

  constructor(actor: string, permission = 'active') {
    this.actor = actor
    this.permission = permission
  }
}
