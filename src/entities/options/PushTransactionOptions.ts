import {Account} from '../Account'
import {Action} from '../Action'

export type EncryptOptions = { publicKey?: string; privateKey?: string; contentType?: string }

export type PushTransactionOptions = {
    account: Account
    action: Action
    data: any
    authPermission?: string | null
    encryptOptions?: EncryptOptions | null
    signingAccount?: string | null,
}
