import { Account, Action, RenewFioDomainResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { SignedTransaction } from './SignedTransaction';
export type RenewFioDomainRequestProps = {
    fioDomain: string;
    maxFee: number;
    technologyProviderId: string;
};
export type RenewFioDomainRequestData = {
    fio_domain: string;
    max_fee: number;
    tpid: string;
    actor: string;
};
export declare class RenewFioDomain extends SignedTransaction<RenewFioDomainRequestData, RenewFioDomainResponse> {
    props: RenewFioDomainRequestProps;
    ENDPOINT: "chain/renew_fio_domain";
    ACTION: Action;
    ACCOUNT: Account;
    constructor(config: RequestConfig, props: RenewFioDomainRequestProps);
    getData: () => {
        actor: string;
        fio_domain: string;
        max_fee: number;
        tpid: string;
    };
}
//# sourceMappingURL=RenewFioDomain.d.ts.map