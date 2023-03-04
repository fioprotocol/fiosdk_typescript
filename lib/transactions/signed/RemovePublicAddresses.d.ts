import { PublicAddress } from '../../entities/PublicAddress';
import { SignedTransaction } from './SignedTransaction';
export declare class RemovePublicAddresses extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    fioAddress: string;
    publicAddresses: PublicAddress[];
    maxFee: number;
    technologyProviderId: string;
    constructor(fioAddress: string, publicAddresses: PublicAddress[], maxFee: number, technologyProviderId?: string);
    getData(): any;
}
//# sourceMappingURL=RemovePublicAddresses.d.ts.map