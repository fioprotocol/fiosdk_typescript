import {Account, Action, EndPoint, LockPeriod, TransferLockedTokensResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Transactions'
import { SignedTransaction } from './SignedTransaction'

export type TransferLockedTokensRequestProps = {
    payeePublicKey: string
    canVote?: boolean
    periods: LockPeriod[]
    amount: number
    maxFee: number
    technologyProviderId: string,
}

export type TransferLockedTokensRequestData = {
    payee_public_key: string
    can_vote: 0 | 1
    periods: LockPeriod[]
    amount: number
    max_fee: number
    actor: string
    tpid: string,
}

export class TransferLockedTokens extends SignedTransaction<
    TransferLockedTokensRequestData,
    TransferLockedTokensResponse
> {
    public ENDPOINT = `chain/${EndPoint.transferLockedTokens}` as const
    public ACTION = Action.transferLockedTokens
    public ACCOUNT = Account.token

    constructor(config: RequestConfig, public props: TransferLockedTokensRequestProps) {
        super(config)

        this.validationData = {tpid: props.technologyProviderId}
        this.validationRules = validationRules.transferLockedTokensRequest
    }

    public getData = () => ({
        actor: this.getActor(),
        amount: this.props.amount,
        can_vote: this.props.canVote ? 1 as const : 0 as const,
        max_fee: this.props.maxFee,
        payee_public_key: this.props.payeePublicKey,
        periods: this.props.periods,
        tpid: this.props.technologyProviderId,
    })
}
