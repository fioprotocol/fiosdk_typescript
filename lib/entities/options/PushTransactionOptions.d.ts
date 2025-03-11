import { Account } from '../Account';
import { Action } from '../Action';
import { ContentType } from '../ContentType';
export type EncryptOptions = {
    publicKey?: string;
    privateKey?: string;
    contentType?: ContentType;
};
export type PushTransactionOptions = {
    account: Account;
    action: Action;
    data: any;
    authPermission?: string | null;
    encryptOptions?: EncryptOptions | null;
    signingAccount?: string | null;
};
//# sourceMappingURL=PushTransactionOptions.d.ts.map