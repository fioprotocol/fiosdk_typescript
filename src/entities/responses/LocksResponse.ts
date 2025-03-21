import {LockPeriod} from '../types/LockPeriod'

export type LocksResponse = {
    lock_amount: number
    remaining_lock_amount: number
    time_stamp: number
    payouts_performed: number
    can_vote: number
    unlock_periods: LockPeriod[],
}
