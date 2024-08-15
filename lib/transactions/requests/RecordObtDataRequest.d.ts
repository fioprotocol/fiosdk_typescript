import { RecordObtDataResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type RecordObtDataRequestData = {
    payer_fio_address: string;
    payee_fio_address: string;
    content: string;
    fio_request_id: number;
    max_fee: number;
    actor: string;
    tpid: string;
};
export type RecordObtDataRequestProps = {
    amount: number;
    chainCode: string;
    encryptPrivateKey?: string;
    fioRequestId?: number;
    hash?: string;
    maxFee: number;
    memo?: string;
    obtId: string;
    offLineUrl?: string;
    payeeFioAddress: string;
    payerFioAddress: string;
    payeeTokenPublicAddress: string;
    payerTokenPublicAddress: string;
    payeeFioPublicKey?: string;
    status?: string;
    technologyProviderId: string;
    tokenCode: string;
};
export declare class RecordObtDataRequest extends SignedRequest<RecordObtDataRequestData, RecordObtDataResponse> {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    props: ReturnType<RecordObtDataRequest['getResolvedProps']>;
    content: ReturnType<RecordObtDataRequest['getResolvedContent']>;
    constructor(config: RequestConfig, props: RecordObtDataRequestProps);
    getData: () => {
        actor: string;
        content: string;
        fio_request_id: number;
        max_fee: number;
        payee_fio_address: string;
        payer_fio_address: string;
        tpid: string;
    };
    getResolvedContent: () => {
        amount: string;
        chain_code: string;
        hash: string | null;
        memo: string | null;
        obt_id: string;
        offline_url: string | null;
        payee_public_address: string;
        payer_public_address: string;
        status: string;
        token_code: string;
    };
    getResolvedProps: (props: RecordObtDataRequestProps) => {
        encryptPrivateKey: string | null;
        fioRequestId: number;
        hash: string | null;
        memo: string | null;
        offLineUrl: string | null;
        status: string;
        payeeFioPublicKey: string;
        amount: number;
        chainCode: string;
        maxFee: number;
        obtId: string;
        payeeFioAddress: string;
        payerFioAddress: string;
        payeeTokenPublicAddress: string;
        payerTokenPublicAddress: string;
        technologyProviderId: string;
        tokenCode: string;
    };
}
//# sourceMappingURL=RecordObtDataRequest.d.ts.map