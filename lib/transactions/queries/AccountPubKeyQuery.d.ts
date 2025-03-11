import { AccountPubKeyResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type AccountPubKeyQueryProps = {
    account: string;
};
export type AccountPubKeyQueryData = {
    account: string;
};
export declare class AccountPubKeyQuery extends Query<AccountPubKeyQueryData, AccountPubKeyResponse> {
    props: AccountPubKeyQueryProps;
    ENDPOINT: "chain/get_account_fio_public_key";
    constructor(config: RequestConfig, props: AccountPubKeyQueryProps);
    getData: () => {
        account: string;
    };
}
//# sourceMappingURL=AccountPubKeyQuery.d.ts.map