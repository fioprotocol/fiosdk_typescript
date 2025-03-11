import { Account, Action, EncryptOptions } from '../../entities';
import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type PushRequestProps = {
    action: Action;
    account?: Account;
    data: any;
    encryptOptions: EncryptOptions;
    authPermission: string | undefined;
    signingAccount: string | undefined;
};
export declare class PushRequest extends SignedRequest {
    ENDPOINT: "chain/push_transaction";
    ACTION: Action;
    ACCOUNT: Account;
    private readonly data;
    private readonly encryptOptions;
    constructor(config: RequestConfig, props: PushRequestProps);
    getData(): any;
}
//# sourceMappingURL=PushRequest.d.ts.map