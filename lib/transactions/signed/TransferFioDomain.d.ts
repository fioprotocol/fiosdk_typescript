import { Account, Action, TransferFioDomainResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { SignedTransaction } from './SignedTransaction';
export type TransferFioDomainRequestProps = {
    fioDomain: string;
    newOwnerKey: string;
    maxFee: number;
    technologyProviderId: string;
};
export type TransferFioDomainRequestData = {
    actor: string;
    fio_domain: string;
    max_fee: number;
    new_owner_fio_public_key: string;
    tpid: string;
};
export declare class TransferFioDomain extends SignedTransaction<TransferFioDomainRequestData, TransferFioDomainResponse> {
    props: TransferFioDomainRequestProps;
    ENDPOINT: "chain/transfer_fio_domain";
    ACTION: Action;
    ACCOUNT: Account;
    constructor(config: RequestConfig, props: TransferFioDomainRequestProps);
    getData: () => {
        actor: string;
        fio_domain: string;
        max_fee: number;
        new_owner_fio_public_key: string;
        tpid: string;
    };
}
//# sourceMappingURL=TransferFioDomain.d.ts.map