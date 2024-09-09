import {LockPeriod} from '../types/LockPeriod'

export type TransferLockedTokensOptions = {
    payeePublicKey: string
    canVote: boolean
    periods: LockPeriod[]
    amount: number
    maxFee: number
    technologyProviderId?: string | null,
}
