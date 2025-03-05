import { Account, Action, EncryptOptions } from '../../entities';
import { RequestConfig } from '../Transactions';
import { SignedTransaction } from './SignedTransaction';
export type PushRequestProps = {
    action: Action;
    account?: Account;
    data: any;
    encryptOptions: EncryptOptions;
    authPermission: string | undefined;
    signingAccount: string | undefined;
};
export declare class PushTransaction extends SignedTransaction {
    ENDPOINT: "chain/push_transaction";
    ACTION: Action;
    ACCOUNT: Account;
    private readonly data;
    private readonly encryptOptions;
    constructor(config: RequestConfig, props: PushRequestProps);
    getData(): any;
}
//# sourceMappingURL=PushTransaction.d.ts.map