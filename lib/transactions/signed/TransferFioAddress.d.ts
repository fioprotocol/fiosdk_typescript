import { Account, Action, TransferFioAddressResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { SignedTransaction } from './SignedTransaction';
export type TransferFioAddressRequestProps = {
    fioAddress: string;
    newOwnerKey: string;
    maxFee: number;
    technologyProviderId: string;
};
export type TransferFioAddressRequestData = {
    fio_address: string;
    new_owner_fio_public_key: string;
    actor: string;
    tpid: string;
    max_fee: number;
};
export declare class TransferFioAddress extends SignedTransaction<TransferFioAddressRequestData, TransferFioAddressResponse> {
    props: TransferFioAddressRequestProps;
    ENDPOINT: "chain/transfer_fio_address";
    ACTION: Action;
    ACCOUNT: Account;
    constructor(config: RequestConfig, props: TransferFioAddressRequestProps);
    getData: () => {
        actor: string;
        fio_address: string;
        max_fee: number;
        new_owner_fio_public_key: string;
        tpid: string;
    };
}
//# sourceMappingURL=TransferFioAddress.d.ts.map