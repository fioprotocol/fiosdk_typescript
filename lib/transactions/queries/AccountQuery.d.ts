import { AccountResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type AccountQueryProps = {
    actor: string;
};
export type AccountQueryData = {
    account_name: string;
};
export declare class AccountQuery extends Query<AccountQueryData, AccountResponse> {
    props: AccountQueryProps;
    ENDPOINT: string;
    constructor(config: RequestConfig, props: AccountQueryProps);
    getData: () => {
        account_name: string;
    };
}
//# sourceMappingURL=AccountQuery.d.ts.map