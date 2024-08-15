import { TransferFioAddressResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type TransferFioAddressRequestProps = {
    fioAddress: string;
    newOwnerKey: string;
    maxFee: number;
    technologyProviderId: string;
};
export type TransferFioAddressRequestData = {
    fio_address: string;
    new_owner_fio_public_key: string;
    actor: string;
    tpid: string;
    max_fee: number;
};
export declare class TransferFioAddressRequest extends SignedRequest<TransferFioAddressRequestData, TransferFioAddressResponse> {
    props: TransferFioAddressRequestProps;
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    constructor(config: RequestConfig, props: TransferFioAddressRequestProps);
    getData: () => {
        actor: string;
        fio_address: string;
        max_fee: number;
        new_owner_fio_public_key: string;
        tpid: string;
    };
}
//# sourceMappingURL=TransferFioAddressRequest.d.ts.map