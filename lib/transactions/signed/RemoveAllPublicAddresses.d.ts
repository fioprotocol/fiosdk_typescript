import { Account, Action, RemoveAllPublicAddressesResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { SignedTransaction } from './SignedTransaction';
export type RemoveAllPublicAddressesRequestProps = {
    fioAddress: string;
    maxFee: number;
    technologyProviderId: string;
};
export type RemoveAllPublicAddressesRequestData = {
    fio_address: string;
    actor: string;
    tpid: string;
    max_fee: number;
};
export declare class RemoveAllPublicAddresses extends SignedTransaction<RemoveAllPublicAddressesRequestData, RemoveAllPublicAddressesResponse> {
    props: RemoveAllPublicAddressesRequestProps;
    ENDPOINT: "chain/remove_all_pub_addresses";
    ACTION: Action;
    ACCOUNT: Account;
    constructor(config: RequestConfig, props: RemoveAllPublicAddressesRequestProps);
    getData: () => {
        actor: string;
        fio_address: string;
        max_fee: number;
        tpid: string;
    };
}
//# sourceMappingURL=RemoveAllPublicAddresses.d.ts.map