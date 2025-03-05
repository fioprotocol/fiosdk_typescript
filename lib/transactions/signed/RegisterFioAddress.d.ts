import { Account, Action, RegisterFioAddressResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { SignedTransaction } from './SignedTransaction';
export type RegisterFioAddressRequestData = {
    fio_address: string;
    owner_fio_public_key: string;
    max_fee: number;
    tpid: string;
    actor: string;
};
export type RegisterFioAddressRequestProps = {
    fioAddress: string;
    maxFee: number;
    technologyProviderId: string;
    ownerPublicKey?: string;
};
export declare class RegisterFioAddress extends SignedTransaction<RegisterFioAddressRequestData, RegisterFioAddressResponse> {
    props: RegisterFioAddressRequestProps;
    ENDPOINT: "chain/register_fio_address";
    ACTION: Action;
    ACCOUNT: Account;
    constructor(config: RequestConfig, props: RegisterFioAddressRequestProps);
    getData: () => {
        actor: string;
        fio_address: string;
        max_fee: number;
        owner_fio_public_key: string;
        tpid: string;
    };
}
//# sourceMappingURL=RegisterFioAddress.d.ts.map