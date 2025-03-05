import { NftsResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type NftsByFioAddressQueryProps = {
    fioAddress: string;
    limit?: number;
    offset?: number;
};
export type NftsByFioAddressQueryData = {
    fio_address: string;
    limit?: number;
    offset?: number;
};
export declare class GetNftsByFioAddress extends Query<NftsByFioAddressQueryData, NftsResponse> {
    props: NftsByFioAddressQueryProps;
    ENDPOINT: "chain/get_nfts_fio_address";
    constructor(config: RequestConfig, props: NftsByFioAddressQueryProps);
    getData: () => {
        fio_address: string;
        limit: number | undefined;
        offset: number | undefined;
    };
}
//# sourceMappingURL=GetNftsByFioAddress.d.ts.map