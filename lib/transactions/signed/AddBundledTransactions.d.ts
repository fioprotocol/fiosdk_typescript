import { SignedTransaction } from './SignedTransaction';
export declare class AddBundledTransactions extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    fioAddress: string;
    bundleSets: number;
    maxFee: number;
    technologyProviderId: string;
    constructor(fioAddress: string, bundleSets: number, maxFee: number, technologyProviderId?: string);
    getData(): any;
}
//# sourceMappingURL=AddBundledTransactions.d.ts.map