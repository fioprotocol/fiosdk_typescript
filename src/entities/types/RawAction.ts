import {Account} from '../Account'
import {Action} from '../Action'
import {Authorization} from './Authorization'

export type RawAction = {
    account: Account,
    name: Action,
    authorization: Authorization[]
    data: any
    actor: string | undefined,
}
