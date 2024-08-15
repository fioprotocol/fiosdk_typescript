import { NftsResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type NftsByContractQueryProps = {
    chainCode: string;
    contractAddress: string;
    tokenId?: string;
    limit?: number;
    offset?: number;
};
export type NftsByContractQueryData = {
    chain_code: string;
    contract_address: string;
    token_id?: string;
    limit?: number;
    offset?: number;
};
export declare class NftsByContractQuery extends Query<NftsByContractQueryData, NftsResponse> {
    props: NftsByContractQueryProps;
    ENDPOINT: string;
    constructor(config: RequestConfig, props: NftsByContractQueryProps);
    getData: () => {
        chain_code: string;
        contract_address: string;
        limit: number | undefined;
        offset: number | undefined;
        token_id: string | undefined;
    };
}
//# sourceMappingURL=NftsByContractQuery.d.ts.map