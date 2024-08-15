import {Authorization} from './Authorization'

export type RawAction = {
    account: string // 'testeostoken',
    name: string // 'transfer',
    authorization: Authorization[]
    data: any
    actor: string | undefined,
}
