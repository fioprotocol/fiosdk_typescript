import {Account, Action, EndPoint, RejectFundsResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Transactions'
import { SignedTransaction } from './SignedTransaction'

export type RejectFundsRequestRequestProps = {
    fioRequestId: number
    maxFee: number
    technologyProviderId: string,
}

export type RejectFundsRequestRequestData = {
    fio_request_id: number
    max_fee: number
    tpid: string
    actor: string,
}

export class RejectFundsRequest extends SignedTransaction<
    RejectFundsRequestRequestData,
    RejectFundsResponse
> {
    public ENDPOINT = `chain/${EndPoint.rejectFundsRequest}` as const
    public ACTION = Action.rejectFundsRequest
    public ACCOUNT = Account.reqObt

    constructor(config: RequestConfig, public props: RejectFundsRequestRequestProps) {
        super(config)

        this.validationData = {tpid: props.technologyProviderId}
        this.validationRules = validationRules.rejectFunds
    }

    public getData = () => ({
        actor: this.getActor(),
        fio_request_id: this.props.fioRequestId,
        max_fee: this.props.maxFee,
        tpid: this.props.technologyProviderId,
    })

}
