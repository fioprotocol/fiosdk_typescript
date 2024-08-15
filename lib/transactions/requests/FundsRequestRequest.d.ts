import { FundsRequestResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type FundsRequestRequestProps = {
    amount: number;
    maxFee: number;
    chainCode: string;
    tokenCode: string;
    payeeFioAddress: string;
    payerFioAddress: string;
    payeeTokenPublicAddress: string;
    payerFioPublicKey?: string;
    hash?: string;
    memo?: string;
    offlineUrl?: string;
    encryptPrivateKey?: string;
    technologyProviderId: string;
};
export type FundsRequestRequestData = {
    actor: string;
    content: string;
    max_fee: number;
    payee_fio_address: string;
    payer_fio_address: string;
    tpid: string;
};
export declare class FundsRequestRequest extends SignedRequest<FundsRequestRequestData, FundsRequestResponse> {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    props: ReturnType<FundsRequestRequest['getResolvedProps']>;
    content: ReturnType<FundsRequestRequest['getResolvedContent']>;
    constructor(config: RequestConfig, props: FundsRequestRequestProps);
    getData: () => {
        actor: string;
        content: string;
        max_fee: number;
        payee_fio_address: string;
        payer_fio_address: string;
        tpid: string;
    };
    getResolvedProps: (props: FundsRequestRequestProps) => {
        encryptPrivateKey: string | null;
        hash: string | null;
        memo: string | null;
        offlineUrl: string | null;
        payerFioPublicKey: string;
        amount: number;
        maxFee: number;
        chainCode: string;
        tokenCode: string;
        payeeFioAddress: string;
        payerFioAddress: string;
        payeeTokenPublicAddress: string;
        technologyProviderId: string;
    };
    getResolvedContent: () => {
        amount: string;
        chain_code: string;
        hash: string | null;
        memo: string | null;
        offline_url: string | null;
        payee_public_address: string;
        token_code: string;
    };
}
//# sourceMappingURL=FundsRequestRequest.d.ts.map