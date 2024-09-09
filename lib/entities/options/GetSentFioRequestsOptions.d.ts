import { KeysPair } from '../types/KeysPair';
export type GetSentFioRequestsOptions = {
    limit?: number | null;
    offset?: number | null;
    includeEncrypted?: boolean | null;
    encryptKeys?: Map<string, KeysPair[]> | null;
};
//# sourceMappingURL=GetSentFioRequestsOptions.d.ts.map