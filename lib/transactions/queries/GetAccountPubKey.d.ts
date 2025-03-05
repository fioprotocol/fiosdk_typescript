import { AccountResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type AccountPubKeyQueryProps = {
    account: string;
};
export type AccountPubKeyQueryData = {
    account: string;
};
export declare class GetAccountPubKey extends Query<AccountPubKeyQueryData, AccountResponse> {
    props: AccountPubKeyQueryProps;
    ENDPOINT: "chain/get_account_fio_public_key";
    constructor(config: RequestConfig, props: AccountPubKeyQueryProps);
    getData: () => {
        account: string;
    };
}
//# sourceMappingURL=GetAccountPubKey.d.ts.map