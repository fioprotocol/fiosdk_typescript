import { SignedTransaction } from './SignedTransaction'
import { LockPeriod } from '../../entities/LockPeriod'
import { validationRules } from '../../utils/validation'


export class TransferLockedTokens extends SignedTransaction {
  public ENDPOINT: string = 'chain/transfer_locked_tokens'
  public ACTION: string = 'trnsloctoks'
  public ACCOUNT: string = 'fio.token'
  public payeePublicKey: string
  public canVote: number
  public periods: LockPeriod[]
  public amount: number
  public maxFee: number
  public technologyProviderId: string

  constructor(payeePublicKey: string, canVote: boolean, periods: LockPeriod[], amount: number, maxFee: number, technologyProviderId: string = '') {
    super()
    this.payeePublicKey = payeePublicKey
    this.canVote = canVote ? 1 : 0
    this.periods = periods
    this.amount = amount
    this.maxFee = maxFee
    this.technologyProviderId = technologyProviderId

    this.validationData = { tpid: technologyProviderId || null }
    this.validationRules = validationRules.transferLockedTokensRequest
  }

  public getData(): any {
    const actor = this.getActor()
    const data = {
      payee_public_key: this.payeePublicKey,
      can_vote: this.canVote,
      periods: this.periods,
      amount: this.amount,
      max_fee: this.maxFee,
      actor,
      tpid: this.technologyProviderId
    }
    return data
  }
}
