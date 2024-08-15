import { SetFioDomainVisibilityResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
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
export declare class SetFioDomainVisibilityRequest extends SignedRequest<SetFioDomainVisibilityRequestData, SetFioDomainVisibilityResponse> {
    props: SetFioDomainVisibilityRequestProps;
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    constructor(config: RequestConfig, props: SetFioDomainVisibilityRequestProps);
    getData: () => {
        actor: string;
        fio_domain: string;
        is_public: 0 | 1;
        max_fee: number;
        tpid: string;
    };
}
//# sourceMappingURL=SetFioDomainVisibilityRequest.d.ts.map