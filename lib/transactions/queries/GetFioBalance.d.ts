import { BalanceResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type FioBalanceQueryProps = {
    fioPublicKey?: string;
};
export type FioBalanceQueryData = {
    fio_public_key: string;
};
export declare class GetFioBalance extends Query<FioBalanceQueryData, BalanceResponse> {
    props: FioBalanceQueryProps;
    ENDPOINT: "chain/get_fio_balance";
    constructor(config: RequestConfig, props: FioBalanceQueryProps);
    getData: () => {
        fio_public_key: string;
    };
}
//# sourceMappingURL=GetFioBalance.d.ts.map