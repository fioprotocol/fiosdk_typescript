import { AbiResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type AbiQueryProps = {
    accountName: string;
};
export type AbiQueryData = {
    account_name: string;
};
export declare class GetAbi extends Query<AbiQueryData, AbiResponse> {
    props: AbiQueryProps;
    ENDPOINT: "chain/get_raw_abi";
    constructor(config: RequestConfig, props: AbiQueryProps);
    getData: () => {
        account_name: string;
    };
}
//# sourceMappingURL=GetAbi.d.ts.map