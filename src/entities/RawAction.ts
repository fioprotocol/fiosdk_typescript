import { Autorization } from './Autorization'

export class RawAction {
  public account: string = '' // 'testeostoken',
  public name: string = '' // 'transfer',
  public authorization: Autorization[] = new Array<Autorization>()
  public data: any
  public actor: string | undefined
}
