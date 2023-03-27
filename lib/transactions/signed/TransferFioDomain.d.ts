import { SignedTransaction } from './SignedTransaction';
export declare class TransferFioDomain extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    fioDomain: string;
    newOwnerKey: string;
    maxFee: number;
    technologyProviderId: string;
    constructor(fioDomain: string, newOwnerKey: string, maxFee: number, technologyProviderId?: string);
    getData(): any;
}
//# sourceMappingURL=TransferFioDomain.d.ts.map