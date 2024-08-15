import { CancelFundsRequestResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type CancelFundsRequestRequestProps = {
    fioRequestId: number;
    maxFee: number;
    technologyProviderId: string;
};
export type CancelFundsRequestRequestData = {
    fio_request_id: number;
    max_fee: number;
    tpid: string;
    actor: string;
};
export declare class CancelFundsRequestRequest extends SignedRequest<CancelFundsRequestRequestData, CancelFundsRequestResponse> {
    props: CancelFundsRequestRequestProps;
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    constructor(config: RequestConfig, props: CancelFundsRequestRequestProps);
    getData: () => {
        actor: string;
        fio_request_id: number;
        max_fee: number;
        tpid: string;
    };
}
//# sourceMappingURL=CancelFundsRequestRequest.d.ts.map