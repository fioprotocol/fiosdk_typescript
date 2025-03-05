import {Account, Action, CancelFundsRequestResponse, EndPoint} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Transactions'
import { SignedTransaction } from './SignedTransaction'

export type CancelFundsRequestRequestProps = {
    fioRequestId: number;
    maxFee: number;
    technologyProviderId: string;
}

export type CancelFundsRequestRequestData = {
    fio_request_id: number;
    max_fee: number;
    tpid: string;
    actor: string;
}

export class CancelFundsRequest extends SignedTransaction<
    CancelFundsRequestRequestData,
    CancelFundsRequestResponse
> {
    public ENDPOINT = `chain/${EndPoint.cancelFundsRequest}` as const
    public ACTION = Action.cancelFundsRequest
    public ACCOUNT = Account.reqObt

    constructor(config: RequestConfig, public props: CancelFundsRequestRequestProps) {
        super(config)

        this.validationData = {tpid: props.technologyProviderId}
        this.validationRules = validationRules.cancelFundsRequestRules
    }

    public getData = () => ({
        actor: this.getActor(),
        fio_request_id: this.props.fioRequestId,
        max_fee: this.props.maxFee,
        tpid: this.props.technologyProviderId,
    })
}
