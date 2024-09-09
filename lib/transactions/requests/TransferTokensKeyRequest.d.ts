import { Account, Action, TransferTokensKeyResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type TransferTokensKeyRequestProps = {
    payeeFioPublicKey: string;
    amount: number;
    maxFee: number;
    technologyProviderId: string;
};
export type TransferTokensKeyRequestData = {
    actor: string;
    amount: number;
    max_fee: number;
    payee_public_key: string;
    tpid: string;
};
export declare class TransferTokensKeyRequest extends SignedRequest<TransferTokensKeyRequestData, TransferTokensKeyResponse> {
    private props;
    ENDPOINT: "chain/transfer_tokens_pub_key";
    ACTION: Action;
    ACCOUNT: Account;
    constructor(config: RequestConfig, props: TransferTokensKeyRequestProps);
    prepareResponse(result: any): any;
    getData: () => {
        actor: string;
        amount: number;
        max_fee: number;
        payee_public_key: string;
        tpid: string;
    };
}
//# sourceMappingURL=TransferTokensKeyRequest.d.ts.map