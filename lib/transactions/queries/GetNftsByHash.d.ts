import { NftsResponse } from '../../entities/NftsResponse';
import { Query } from './Query';
export declare class GetNftsByHash extends Query<NftsResponse> {
    ENDPOINT: string;
    hash: string;
    limit: number | null;
    offset: number | null;
    constructor(hash: string, limit?: number, offset?: number);
    getData(): {
        hash: string;
        limit: number | null;
        offset: number | null;
    };
}
//# sourceMappingURL=GetNftsByHash.d.ts.map