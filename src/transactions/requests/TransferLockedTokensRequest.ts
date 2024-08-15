import {LockPeriod, TransferLockedTokensResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

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

export class TransferLockedTokensRequest extends SignedRequest<
    TransferLockedTokensRequestData,
    TransferLockedTokensResponse
> {
    public ENDPOINT = 'chain/transfer_locked_tokens'
    public ACTION = 'trnsloctoks'
    public ACCOUNT = 'fio.token'

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
