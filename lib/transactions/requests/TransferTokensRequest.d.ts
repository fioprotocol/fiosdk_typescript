import { TransferTokensResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type TransferTokensRequestProps = {
    payeeFioPublicKey: string;
    amount: number;
    maxFee: number;
    technologyProviderId: string;
};
export type TransferTokensRequestData = {
    actor: string;
    amount: string;
    max_fee: number;
    payee_public_key: string;
    tpid: string;
};
export declare class TransferTokensRequest extends SignedRequest<TransferTokensRequestData, TransferTokensResponse> {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    props: ReturnType<TransferTokensRequest['getResolvedProps']>;
    constructor(config: RequestConfig, props: TransferTokensRequestProps);
    prepareResponse(result: any): any;
    getData: () => {
        actor: string;
        amount: string;
        max_fee: number;
        payee_public_key: string;
        tpid: string;
    };
    private getResolvedProps;
}
//# sourceMappingURL=TransferTokensRequest.d.ts.map