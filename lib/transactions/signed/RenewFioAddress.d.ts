import { Account, Action, RenewFioAddressResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { SignedTransaction } from './SignedTransaction';
export type RenewFioAddressRequestProps = {
    fioAddress: string;
    maxFee: number;
    technologyProviderId: string;
};
export type RenewFioAddressRequestData = {
    fio_address: string;
    max_fee: number;
    tpid: string;
    actor: string;
};
export declare class RenewFioAddress extends SignedTransaction<RenewFioAddressRequestData, RenewFioAddressResponse> {
    props: RenewFioAddressRequestProps;
    ENDPOINT: "chain/renew_fio_address";
    ACTION: Action;
    ACCOUNT: Account;
    constructor(config: RequestConfig, props: RenewFioAddressRequestProps);
    getData: () => {
        actor: string;
        fio_address: string;
        max_fee: number;
        tpid: string;
    };
}
//# sourceMappingURL=RenewFioAddress.d.ts.map