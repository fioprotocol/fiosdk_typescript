import { SignedTransaction } from './SignedTransaction';
export declare class TransferFioAddress extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    fioAddress: string;
    newOwnerKey: string;
    maxFee: number;
    technologyProviderId: string;
    constructor(fioAddress: string, newOwnerKey: string, maxFee: number, technologyProviderId?: string);
    getData(): any;
}
//# sourceMappingURL=TransferFioAddress.d.ts.map