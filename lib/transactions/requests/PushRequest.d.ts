import { RequestConfig } from '../Request';
import { SignedRequest } from './SignedRequest';
export type EncryptOptions = {
    publicKey?: string;
    privateKey?: string;
    contentType?: string;
};
export type PushRequestProps = {
    action: string;
    account?: string;
    data: any;
    encryptOptions: EncryptOptions;
    authPermission: string | undefined;
    signingAccount: string | undefined;
};
export declare class PushRequest extends SignedRequest {
    props: PushRequestProps;
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    constructor(config: RequestConfig, props: PushRequestProps);
    getData(): any;
}
//# sourceMappingURL=PushRequest.d.ts.map