import { AccountPubKeyResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type AccountPubKeyQueryProps = {
    account: string;
};
export type AccountPubKeyQueryData = {
    account: string;
};
export declare class AccountPubKeyQuery extends Query<AccountPubKeyQueryData, AccountPubKeyResponse> {
    props: AccountPubKeyQueryProps;
    ENDPOINT: string;
    constructor(config: RequestConfig, props: AccountPubKeyQueryProps);
    getData: () => {
        account: string;
    };
}
//# sourceMappingURL=AccountPubKeyQuery.d.ts.map