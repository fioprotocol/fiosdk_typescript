import { LocksResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type LocksQueryProps = {
    fioPublicKey: string;
};
export type LocksQueryData = {
    fio_public_key: string;
};
export declare class GetLocks extends Query<LocksQueryData, LocksResponse> {
    props: LocksQueryProps;
    ENDPOINT: "chain/get_locks";
    constructor(config: RequestConfig, props: LocksQueryProps);
    getData: () => {
        fio_public_key: string;
    };
}
//# sourceMappingURL=GetLocks.d.ts.map