import { PublicAddress, RemovePublicAddressesResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type RemovePublicAddressesRequestProps = {
    fioAddress: string;
    publicAddresses: PublicAddress[];
    maxFee: number;
    technologyProviderId: string;
};
export type RemovePublicAddressesRequestData = {
    actor: string;
    fio_address: string;
    max_fee: number;
    public_addresses: PublicAddress[];
    tpid: string;
};
export declare class RemovePublicAddressesRequest extends SignedRequest<RemovePublicAddressesRequestData, RemovePublicAddressesResponse> {
    props: RemovePublicAddressesRequestProps;
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    constructor(config: RequestConfig, props: RemovePublicAddressesRequestProps);
    getData: () => {
        actor: string;
        fio_address: string;
        max_fee: number;
        public_addresses: PublicAddress[];
        tpid: string;
    };
}
//# sourceMappingURL=RemovePublicAddressesRequest.d.ts.map