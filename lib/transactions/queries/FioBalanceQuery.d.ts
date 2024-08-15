import { FioBalanceResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type FioBalanceQueryProps = {
    fioPublicKey?: string;
};
export type FioBalanceQueryData = {
    fio_public_key: string;
};
export declare class FioBalanceQuery extends Query<FioBalanceQueryData, FioBalanceResponse> {
    props: FioBalanceQueryProps;
    ENDPOINT: string;
    constructor(config: RequestConfig, props: FioBalanceQueryProps);
    getData: () => {
        fio_public_key: string;
    };
}
//# sourceMappingURL=FioBalanceQuery.d.ts.map