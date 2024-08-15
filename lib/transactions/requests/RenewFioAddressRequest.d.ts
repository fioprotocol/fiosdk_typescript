import { RenewFioAddressResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type RenewFioAddressRequestProps = {
    fioAddress: string;
    maxFee: number;
    technologyProviderId: string;
};
export type RenewFioAddressRequestData = {
    fio_address: string;
    max_fee: number;
    tpid: string;
    actor: string;
};
export declare class RenewFioAddressRequest extends SignedRequest<RenewFioAddressRequestData, RenewFioAddressResponse> {
    props: RenewFioAddressRequestProps;
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    constructor(config: RequestConfig, props: RenewFioAddressRequestProps);
    getData: () => {
        actor: string;
        fio_address: string;
        max_fee: number;
        tpid: string;
    };
}
//# sourceMappingURL=RenewFioAddressRequest.d.ts.map