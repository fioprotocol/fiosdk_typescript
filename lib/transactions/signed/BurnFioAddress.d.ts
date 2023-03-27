import { SignedTransaction } from './SignedTransaction';
export declare class BurnFioAddress extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    fioAddress: string;
    maxFee: number;
    technologyProviderId: string;
    constructor(fioAddress: string, maxFee: number, technologyProviderId?: string);
    getData(): any;
}
//# sourceMappingURL=BurnFioAddress.d.ts.map