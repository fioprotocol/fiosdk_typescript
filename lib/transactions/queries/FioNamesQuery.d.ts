import { FioNamesResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type FioNamesQueryProps = {
    fioPublicKey: string;
};
export type FioNamesQueryData = {
    fio_public_key: string;
};
export declare class FioNamesQuery extends Query<FioNamesQueryData, FioNamesResponse> {
    props: FioNamesQueryProps;
    ENDPOINT: string;
    constructor(config: RequestConfig, props: FioNamesQueryProps);
    getData: () => {
        fio_public_key: string;
    };
}
//# sourceMappingURL=FioNamesQuery.d.ts.map