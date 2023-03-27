import { SignedTransaction } from './SignedTransaction';
export declare class RecordObtData extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    payerFioAddress: string;
    payeeFioPublicKey: string;
    payeeFioAddress: string;
    fioRequestId: number | null;
    maxFee: number;
    technologyProviderId: string;
    payerPublicAddress: string;
    payeePublicAddress: string;
    defaultStatus: string;
    content: any;
    constructor(fioRequestId: number | null, payerFioAddress: string, payeeFioAddress: string, payerPublicAddress: string, payeePublicAddress: string, amount: number, chainCode: string, tokenCode: string, obtID: string, maxFee: number, status: string, technologyProviderId: string | undefined, payeeFioPublicKey: string, memo?: string | null, hash?: string | null, offLineUrl?: string | null);
    getData(): any;
}
//# sourceMappingURL=RecordObtData.d.ts.map