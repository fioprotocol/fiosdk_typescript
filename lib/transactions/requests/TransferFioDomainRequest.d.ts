import { TransferFioDomainResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
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
export declare class TransferFioDomainRequest extends SignedRequest<TransferFioDomainRequestData, TransferFioDomainResponse> {
    props: TransferFioDomainRequestProps;
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    constructor(config: RequestConfig, props: TransferFioDomainRequestProps);
    getData: () => {
        actor: string;
        fio_domain: string;
        max_fee: number;
        new_owner_fio_public_key: string;
        tpid: string;
    };
}
//# sourceMappingURL=TransferFioDomainRequest.d.ts.map