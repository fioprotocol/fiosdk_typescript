import { NftsResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type NftsByHashQueryProps = {
    hash: string;
    limit?: number;
    offset?: number;
};
export type NftsByHashQueryData = {
    hash: string;
    limit?: number;
    offset?: number;
};
export declare class GetNftsByHash extends Query<NftsByHashQueryData, NftsResponse> {
    props: NftsByHashQueryProps;
    ENDPOINT: "chain/get_nfts_hash";
    constructor(config: RequestConfig, props: NftsByHashQueryProps);
    getData: () => {
        hash: string;
        limit: number | undefined;
        offset: number | undefined;
    };
}
//# sourceMappingURL=GetNftsByHash.d.ts.map