import { LocksResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type LocksQueryProps = {
    fioPublicKey: string;
};
export type LocksQueryData = {
    fio_public_key: string;
};
export declare class LocksQuery extends Query<LocksQueryData, LocksResponse> {
    props: LocksQueryProps;
    ENDPOINT: "chain/get_locks";
    constructor(config: RequestConfig, props: LocksQueryProps);
    getData: () => {
        fio_public_key: string;
    };
}
//# sourceMappingURL=LocksQuery.d.ts.map