import { AddBundledResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type AddBundledRequestProps = {
    fioAddress: string;
    bundleSets: number;
    maxFee: number;
    technologyProviderId: string;
};
export type AddBundledRequestData = {
    actor: any;
    bundle_sets: number;
    fio_address: string;
    max_fee: number;
    tpid: string;
};
export declare class AddBundledRequest extends SignedRequest<AddBundledRequestData, AddBundledResponse> {
    props: AddBundledRequestProps;
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    constructor(config: RequestConfig, props: AddBundledRequestProps);
    getData: () => {
        actor: string;
        bundle_sets: number;
        fio_address: string;
        max_fee: number;
        tpid: string;
    };
}
//# sourceMappingURL=AddBundledRequest.d.ts.map