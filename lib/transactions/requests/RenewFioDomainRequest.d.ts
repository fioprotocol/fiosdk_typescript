import { RenewFioDomainResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
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
export declare class RenewFioDomainRequest extends SignedRequest<RenewFioDomainRequestData, RenewFioDomainResponse> {
    props: RenewFioDomainRequestProps;
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    constructor(config: RequestConfig, props: RenewFioDomainRequestProps);
    getData: () => {
        actor: string;
        fio_domain: string;
        max_fee: number;
        tpid: string;
    };
}
//# sourceMappingURL=RenewFioDomainRequest.d.ts.map