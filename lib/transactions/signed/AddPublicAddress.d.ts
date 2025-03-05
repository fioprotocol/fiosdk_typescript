import { Account, Action, AddPublicAddressesResponse, PublicAddress } from '../../entities';
import { RequestConfig } from '../Transactions';
import { SignedTransaction } from './SignedTransaction';
export type AddPublicAddressesRequestProps = {
    fioAddress: string;
    publicAddresses: PublicAddress[];
    maxFee: number;
    technologyProviderId: string;
};
export type AddPublicAddressesRequestData = {
    actor: string;
    fio_address: string;
    public_addresses: PublicAddress[];
    tpid: string;
    max_fee: number;
};
export declare class AddPublicAddresses extends SignedTransaction<AddPublicAddressesRequestData, AddPublicAddressesResponse> {
    props: AddPublicAddressesRequestProps;
    ENDPOINT: "chain/add_pub_address";
    ACTION: Action;
    ACCOUNT: Account;
    constructor(config: RequestConfig, props: AddPublicAddressesRequestProps);
    getData: () => {
        actor: string;
        fio_address: string;
        max_fee: number;
        public_addresses: PublicAddress[];
        tpid: string;
    };
}
//# sourceMappingURL=AddPublicAddress.d.ts.map