import { Account, Action, SetFioDomainVisibilityResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { SignedTransaction } from './SignedTransaction';
export type SetFioDomainVisibilityRequestProps = {
    fioDomain: string;
    isPublic: boolean;
    maxFee: number;
    technologyProviderId: string;
};
export type SetFioDomainVisibilityRequestData = {
    fio_domain: string;
    is_public: 0 | 1;
    max_fee: number;
    tpid: string;
    actor: string;
};
export declare class SetFioDomainVisibility extends SignedTransaction<SetFioDomainVisibilityRequestData, SetFioDomainVisibilityResponse> {
    props: SetFioDomainVisibilityRequestProps;
    ENDPOINT: "chain/set_fio_domain_public";
    ACTION: Action;
    ACCOUNT: Account;
    constructor(config: RequestConfig, props: SetFioDomainVisibilityRequestProps);
    getData: () => {
        actor: string;
        fio_domain: string;
        is_public: 0 | 1;
        max_fee: number;
        tpid: string;
    };
}
//# sourceMappingURL=SetFioDomainVisibility.d.ts.map