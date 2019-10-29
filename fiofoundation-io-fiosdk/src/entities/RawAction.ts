import { Autorization } from './Autorization'

export class RawAction {
  account: string = '' //'testeostoken',
  name: string = '' //'transfer',
  authorization: Array<Autorization> = new Array<Autorization>()
  data: any
}