import { SignedTransaction } from './SignedTransaction';
export declare class SetFioDomainVisibility extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    fioDomain: string;
    isPublic: number;
    maxFee: number;
    technologyProviderId: string;
    constructor(fioDomain: string, isPublic: boolean, maxFee: number, technologyProviderId?: string);
    getData(): any;
}
//# sourceMappingURL=SetFioDomainVisibility.d.ts.map