import { Account, Action, FioSentItemContent, RecordObtDataResponse, FioRequestStatus } from '../../entities';
import { RequestConfig } from '../Transactions';
import { SignedTransaction } from './SignedTransaction';
export type RecordObtDataRequestData = {
    payer_fio_address: string;
    payee_fio_address: string;
    content: string;
    fio_request_id?: number;
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
    status?: FioRequestStatus;
    technologyProviderId: string;
    tokenCode: string;
};
export declare class RecordObtData extends SignedTransaction<RecordObtDataRequestData, RecordObtDataResponse> {
    ENDPOINT: "chain/record_obt_data";
    ACTION: Action;
    ACCOUNT: Account;
    props: ReturnType<RecordObtData['getResolvedProps']>;
    constructor(config: RequestConfig, props: RecordObtDataRequestProps);
    getData: () => {
        actor: string;
        content: string;
        fio_request_id: number | undefined;
        max_fee: number;
        payee_fio_address: string;
        payer_fio_address: string;
        tpid: string;
    };
    getResolvedContent: () => FioSentItemContent;
    getResolvedProps: (props: RecordObtDataRequestProps) => {
        encryptPrivateKey: string | null;
        hash: string | null;
        memo: string | null;
        offLineUrl: string | null;
        payeeFioPublicKey: string;
        status: FioRequestStatus;
        amount: number;
        chainCode: string;
        fioRequestId?: number;
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
//# sourceMappingURL=RecordObtData.d.ts.map