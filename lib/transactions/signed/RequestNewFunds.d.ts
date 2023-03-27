import { SignedTransaction } from './SignedTransaction';
export declare class RequestNewFunds extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    payerFioAddress: string;
    payerFioPublicKey: string;
    payeeFioAddress: string;
    chainCode: string;
    tokenCode: string;
    maxFee: number;
    content: any;
    technologyProviderId: string;
    constructor(payerFioAddress: string, payerFioPublicKey: string, payeeFioAddress: string, technologyProviderId: string | undefined, maxFee: number, payeeTokenPublicAddress: string, amount: number, chainCode: string, tokenCode: string, memo?: string | null, hash?: string | null, offlineUrl?: string | null);
    getData(): any;
}
//# sourceMappingURL=RequestNewFunds.d.ts.map