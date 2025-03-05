import { Account, Action, RejectFundsResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { SignedTransaction } from './SignedTransaction';
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
export declare class RejectFundsRequest extends SignedTransaction<RejectFundsRequestRequestData, RejectFundsResponse> {
    props: RejectFundsRequestRequestProps;
    ENDPOINT: "chain/reject_funds_request";
    ACTION: Action;
    ACCOUNT: Account;
    constructor(config: RequestConfig, props: RejectFundsRequestRequestProps);
    getData: () => {
        actor: string;
        fio_request_id: number;
        max_fee: number;
        tpid: string;
    };
}
//# sourceMappingURL=RejectFundsRequest.d.ts.map