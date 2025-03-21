import { PublicAddressesResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type PublicAddressesQueryProps = {
    fioAddress: string;
    limit?: number;
    offset?: number;
};
export type PublicAddressesQueryData = {
    fio_address: string;
    limit?: number;
    offset?: number;
};
export declare class PublicAddressesQuery extends Query<PublicAddressesQueryData, PublicAddressesResponse> {
    props: PublicAddressesQueryProps;
    ENDPOINT: "chain/get_pub_addresses";
    constructor(config: RequestConfig, props: PublicAddressesQueryProps);
    getData: () => {
        fio_address: string;
        limit: number | undefined;
        offset: number | undefined;
    };
}
//# sourceMappingURL=PublicAddressesQuery.d.ts.map