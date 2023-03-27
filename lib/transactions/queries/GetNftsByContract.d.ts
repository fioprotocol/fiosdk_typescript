import { NftsResponse } from '../../entities/NftsResponse';
import { Query } from './Query';
export declare class GetNftsByContract extends Query<NftsResponse> {
    ENDPOINT: string;
    chainCode: string;
    contractAddress: string;
    tokenId: string | null;
    limit: number | null;
    offset: number | null;
    constructor(chainCode: string, contractAddress: string, tokenId?: string, limit?: number, offset?: number);
    getData(): {
        chain_code: string;
        contract_address: string;
        token_id: string | null;
        limit: number | null;
        offset: number | null;
    };
}
//# sourceMappingURL=GetNftsByContract.d.ts.map