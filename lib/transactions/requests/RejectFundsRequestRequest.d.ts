import { RejectFundsRequestResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type RejectFundsRequestRequestProps = {
    fioRequestId: number;
    maxFee: number;
    technologyProviderId: string;
};
export type RejectFundsRequestRequestData = {
    fio_request_id: number;
    max_fee: number;
    tpid: string;
    actor: string;
};
export declare class RejectFundsRequestRequest extends SignedRequest<RejectFundsRequestRequestData, RejectFundsRequestResponse> {
    props: RejectFundsRequestRequestProps;
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    constructor(config: RequestConfig, props: RejectFundsRequestRequestProps);
    getData: () => {
        actor: string;
        fio_request_id: number;
        max_fee: number;
        tpid: string;
    };
}
//# sourceMappingURL=RejectFundsRequestRequest.d.ts.map