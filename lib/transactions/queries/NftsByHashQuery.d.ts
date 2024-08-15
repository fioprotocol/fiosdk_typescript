import { NftsResponse } from '../../entities';
import { RequestConfig } from '../Request';
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
export declare class NftsByHashQuery extends Query<NftsByHashQueryData, NftsResponse> {
    props: NftsByHashQueryProps;
    ENDPOINT: string;
    constructor(config: RequestConfig, props: NftsByHashQueryProps);
    getData: () => {
        hash: string;
        limit: number | undefined;
        offset: number | undefined;
    };
}
//# sourceMappingURL=NftsByHashQuery.d.ts.map