import { SignedTransaction } from './SignedTransaction';
export declare class RenewFioAddress extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    fioAddress: string;
    maxFee: number;
    technologyProviderId: String;
    constructor(fioAddress: string, maxFee: number, technologyProviderId?: string);
    getData(): any;
}
//# sourceMappingURL=RenewFioAddress.d.ts.map