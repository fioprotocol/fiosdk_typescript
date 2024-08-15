import { RemoveAllPublicAddressesResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type RemoveAllPublicAddressesRequestProps = {
    fioAddress: string;
    maxFee: number;
    technologyProviderId: string;
};
export type RemoveAllPublicAddressesRequestData = {
    fio_address: string;
    actor: string;
    tpid: string;
    max_fee: number;
};
export declare class RemoveAllPublicAddressesRequest extends SignedRequest<RemoveAllPublicAddressesRequestData, RemoveAllPublicAddressesResponse> {
    props: RemoveAllPublicAddressesRequestProps;
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    constructor(config: RequestConfig, props: RemoveAllPublicAddressesRequestProps);
    getData: () => {
        actor: string;
        fio_address: string;
        max_fee: number;
        tpid: string;
    };
}
//# sourceMappingURL=RemoveAllPublicAddressesRequest.d.ts.map