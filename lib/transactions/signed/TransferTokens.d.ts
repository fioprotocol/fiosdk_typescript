import { SignedTransaction } from './SignedTransaction';
export declare class TransferTokens extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    payeePublicKey: string;
    amount: string;
    maxFee: number;
    technologyProviderId: string;
    constructor(payeePublicKey: string, amount: number, maxFee: number, technologyProviderId?: string);
    prepareResponse(result: any): any;
    getData(): any;
}
//# sourceMappingURL=TransferTokens.d.ts.map