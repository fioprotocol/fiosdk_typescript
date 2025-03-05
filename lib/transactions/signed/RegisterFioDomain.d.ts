import { Account, Action, RegisterFioDomainResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { SignedTransaction } from './SignedTransaction';
export type RegisterFioDomainRequestProps = {
    fioDomain: string;
    maxFee: number;
    ownerPublicKey?: string;
    technologyProviderId: string;
};
export type RegisterFioDomainRequestData = {
    actor: string;
    fio_domain: string;
    max_fee: number;
    owner_fio_public_key: string;
    tpid: string;
};
export declare class RegisterFioDomain extends SignedTransaction<RegisterFioDomainRequestData, RegisterFioDomainResponse> {
    props: RegisterFioDomainRequestProps;
    ENDPOINT: "chain/register_fio_domain";
    ACTION: Action;
    ACCOUNT: Account;
    constructor(config: RequestConfig, props: RegisterFioDomainRequestProps);
    getData: () => {
        actor: string;
        fio_domain: string;
        max_fee: number;
        owner_fio_public_key: string;
        tpid: string;
    };
}
//# sourceMappingURL=RegisterFioDomain.d.ts.map