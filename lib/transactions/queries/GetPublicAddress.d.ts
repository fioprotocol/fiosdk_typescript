import { PublicAddressResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type PublicAddressQueryProps = {
    fioAddress: string;
    chainCode: string;
    tokenCode: string;
};
export type PublicAddressQueryData = {
    fio_address: string;
    chain_code: string;
    token_code: string;
};
export declare class GetPublicAddress extends Query<PublicAddressQueryData, PublicAddressResponse> {
    props: PublicAddressQueryProps;
    ENDPOINT: "chain/get_pub_address";
    constructor(config: RequestConfig, props: PublicAddressQueryProps);
    getData: () => {
        chain_code: string;
        fio_address: string;
        token_code: string;
    };
}
//# sourceMappingURL=GetPublicAddress.d.ts.map