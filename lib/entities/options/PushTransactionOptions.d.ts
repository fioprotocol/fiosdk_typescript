import { EncryptOptions } from '../../transactions/requests/PushRequest';
export type PushTransactionOptions = {
    account: string;
    action: string;
    data: any;
    authPermission?: string | null;
    encryptOptions?: EncryptOptions | null;
    signingAccount?: string | null;
};
//# sourceMappingURL=PushTransactionOptions.d.ts.map