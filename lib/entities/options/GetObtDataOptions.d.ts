import { KeysPair } from '../types/KeysPair';
export type GetObtDataOptions = {
    includeEncrypted: boolean;
    limit?: number | null;
    offset?: number | null;
    tokenCode?: string | null;
    encryptKeys?: Map<string, KeysPair[]> | null;
};
//# sourceMappingURL=GetObtDataOptions.d.ts.map