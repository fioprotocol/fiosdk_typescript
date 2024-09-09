import { Account, Action, RegisterFioDomainResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
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
export declare class RegisterFioDomainRequest extends SignedRequest<RegisterFioDomainRequestData, RegisterFioDomainResponse> {
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
//# sourceMappingURL=RegisterFioDomainRequest.d.ts.map