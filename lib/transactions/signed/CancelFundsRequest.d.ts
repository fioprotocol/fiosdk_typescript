import { SignedTransaction } from './SignedTransaction';
export declare class CancelFundsRequest extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    fioRequestId: number;
    maxFee: number;
    technologyProviderId: string;
    constructor(fioRequestId: number, maxFee: number, technologyProviderId?: string);
    getData(): any;
}
//# sourceMappingURL=CancelFundsRequest.d.ts.map