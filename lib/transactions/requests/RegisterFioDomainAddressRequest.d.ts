import { Account, Action, RegisterFioAddressResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type RegisterFioDomainAddressRequestProps = {
    fioAddress: string;
    maxFee: number;
    isPublic?: boolean;
    ownerPublicKey?: string;
    technologyProviderId: string;
};
export type RegisterFioDomainAddressRequestData = {
    actor: string;
    fio_address: string;
    is_public: 0 | 1;
    max_fee: number;
    owner_fio_public_key: string;
    tpid: string;
};
export declare class RegisterFioDomainAddressRequest extends SignedRequest<RegisterFioDomainAddressRequestData, RegisterFioAddressResponse> {
    props: RegisterFioDomainAddressRequestProps;
    ENDPOINT: "chain/register_fio_domain_address";
    ACTION: Action;
    ACCOUNT: Account;
    constructor(config: RequestConfig, props: RegisterFioDomainAddressRequestProps);
    getData: () => {
        actor: string;
        fio_address: string;
        is_public: 0 | 1;
        max_fee: number;
        owner_fio_public_key: string;
        tpid: string;
    };
}
//# sourceMappingURL=RegisterFioDomainAddressRequest.d.ts.map