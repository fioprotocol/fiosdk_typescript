import { FioAddressesResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type FioAddressesQueryProps = {
    fioPublicKey: string;
    limit?: number;
    offset?: number;
};
export type FioAddressesQueryData = {
    fio_public_key: string;
    limit?: number;
    offset?: number;
};
export declare class FioAddressesQuery extends Query<FioAddressesQueryData, FioAddressesResponse> {
    props: FioAddressesQueryProps;
    ENDPOINT: "chain/get_fio_addresses";
    constructor(config: RequestConfig, props: FioAddressesQueryProps);
    getData: () => {
        fio_public_key: string;
        limit: number | undefined;
        offset: number | undefined;
    };
}
//# sourceMappingURL=FioAddressesQuery.d.ts.map