import { RegisterFioAddressResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type RegisterFioAddressRequestData = {
    fio_address: string;
    owner_fio_public_key: string;
    max_fee: number;
    tpid: string;
    actor: string;
};
export type RegisterFioAddressRequestProps = {
    fioAddress: string;
    maxFee: number;
    technologyProviderId: string;
    ownerPublicKey?: string;
};
export declare class RegisterFioAddressRequest extends SignedRequest<RegisterFioAddressRequestData, RegisterFioAddressResponse> {
    props: RegisterFioAddressRequestProps;
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    constructor(config: RequestConfig, props: RegisterFioAddressRequestProps);
    getData: () => {
        actor: string;
        fio_address: string;
        max_fee: number;
        owner_fio_public_key: string;
        tpid: string;
    };
}
//# sourceMappingURL=RegisterFioAddressRequest.d.ts.map