import { Account, Action, BurnFioAddressResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type BurnFioAddressRequestProps = {
    fioAddress: string;
    maxFee: number;
    technologyProviderId: string;
};
export type BurnFioAddressRequestData = {
    fio_address: string;
    actor: string;
    tpid: string;
    max_fee: number;
};
export declare class BurnFioAddressRequest extends SignedRequest<BurnFioAddressRequestData, BurnFioAddressResponse> {
    props: BurnFioAddressRequestProps;
    ENDPOINT: "chain/burn_fio_address";
    ACTION: Action;
    ACCOUNT: Account;
    constructor(config: RequestConfig, props: BurnFioAddressRequestProps);
    getData: () => {
        actor: string;
        fio_address: string;
        max_fee: number;
        tpid: string;
    };
}
//# sourceMappingURL=BurnFioAddressRequest.d.ts.map