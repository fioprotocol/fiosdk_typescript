import { SignedTransaction } from './SignedTransaction';
export interface EncryptOptions {
    key?: string;
    contentType?: string;
}
export declare class PushTransaction extends SignedTransaction {
    ENDPOINT: string;
    ACTION: string;
    ACCOUNT: string;
    data: any;
    encryptOptions: EncryptOptions;
    constructor(action: string, account: string, data: any, encryptOptions?: EncryptOptions);
    getData(): any;
}
//# sourceMappingURL=PushTransaction.d.ts.map