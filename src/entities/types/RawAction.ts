import {Authorization} from './Authorization'

export type RawAction = {
    // TODO use Account
    account: string // 'testeostoken',
    // TODO use Action?
    name: string // 'transfer',
    authorization: Authorization[]
    data: any
    actor: string | undefined,
}
