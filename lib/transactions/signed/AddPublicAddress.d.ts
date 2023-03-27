import { PublicAddress } from '../../entities/PublicAddress';
import { SignedTransaction } from './SignedTransaction';
export declare class AddPublicAddress extends SignedTransaction {
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
//# sourceMappingURL=AddPublicAddress.d.ts.map