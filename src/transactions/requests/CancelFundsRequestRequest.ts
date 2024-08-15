import {CancelFundsRequestResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

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

export class CancelFundsRequestRequest extends SignedRequest<CancelFundsRequestRequestData, CancelFundsRequestResponse> {
    public ENDPOINT = 'chain/cancel_funds_request'
    public ACTION = 'cancelfndreq'
    public ACCOUNT = 'fio.reqobt'

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
