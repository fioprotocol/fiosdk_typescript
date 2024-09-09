export type RequestFundsOptions = {
    amount: number;
    chainCode: string;
    tokenCode: string;
    maxFee: number;
    payeeFioAddress: string;
    payerFioAddress: string;
    payeeTokenPublicAddress: string;
    encryptPrivateKey?: string | null;
    payerFioPublicKey?: string | null;
    hash?: string | null;
    memo?: string | null;
    offlineUrl?: string | null;
    technologyProviderId?: string | null;
};
//# sourceMappingURL=RequestFundsOptions.d.ts.map