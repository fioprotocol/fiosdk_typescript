import { LockPeriod } from '../../entities/LockPeriod';
import { SignedTransaction } from './SignedTransaction';
export declare class TransferLockedTokens extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    payeePublicKey: string;
    canVote: number;
    periods: LockPeriod[];
    amount: number;
    maxFee: number;
    technologyProviderId: string;
    constructor(payeePublicKey: string, canVote: boolean, periods: LockPeriod[], amount: number, maxFee: number, technologyProviderId?: string);
    getData(): any;
}
//# sourceMappingURL=TransferLockedTokens.d.ts.map