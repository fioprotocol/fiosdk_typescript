import { SignedTransaction } from './SignedTransaction';
export declare class RejectFundsRequest extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    fioreqid: number;
    maxFee: number;
    technologyProviderId: string;
    constructor(fioreqid: number, maxFee: number, technologyProviderId?: string);
    getData(): any;
}
//# sourceMappingURL=RejectFundsRequest.d.ts.map