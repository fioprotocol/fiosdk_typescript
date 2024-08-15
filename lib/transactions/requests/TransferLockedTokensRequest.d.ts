import { LockPeriod, TransferLockedTokensResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type TransferLockedTokensRequestProps = {
    payeePublicKey: string;
    canVote?: boolean;
    periods: LockPeriod[];
    amount: number;
    maxFee: number;
    technologyProviderId: string;
};
export type TransferLockedTokensRequestData = {
    payee_public_key: string;
    can_vote: 0 | 1;
    periods: LockPeriod[];
    amount: number;
    max_fee: number;
    actor: string;
    tpid: string;
};
export declare class TransferLockedTokensRequest extends SignedRequest<TransferLockedTokensRequestData, TransferLockedTokensResponse> {
    props: TransferLockedTokensRequestProps;
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    constructor(config: RequestConfig, props: TransferLockedTokensRequestProps);
    getData: () => {
        actor: string;
        amount: number;
        can_vote: 0 | 1;
        max_fee: number;
        payee_public_key: string;
        periods: LockPeriod[];
        tpid: string;
    };
}
//# sourceMappingURL=TransferLockedTokensRequest.d.ts.map