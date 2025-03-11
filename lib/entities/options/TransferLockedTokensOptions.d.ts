import { LockPeriod } from '../LockPeriod';
export type TransferLockedTokensOptions = {
    payeePublicKey: string;
    canVote: boolean;
    periods: LockPeriod[];
    amount: number;
    maxFee: number;
    technologyProviderId?: string | null;
};
//# sourceMappingURL=TransferLockedTokensOptions.d.ts.map