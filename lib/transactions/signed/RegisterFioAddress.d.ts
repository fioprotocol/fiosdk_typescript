import { SignedTransaction } from './SignedTransaction';
export declare class RegisterFioAddress extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    fioAddress: string;
    ownerPublicKey: string;
    maxFee: number;
    technologyProviderId: string;
    constructor(fioAddress: string, ownerPublicKey: string | null, maxFee: number, technologyProviderId?: string);
    getData(): any;
}
//# sourceMappingURL=RegisterFioAddress.d.ts.map