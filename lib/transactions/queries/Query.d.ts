import { Transactions } from '../Transactions';
export declare abstract class Query<T> extends Transactions {
    abstract ENDPOINT: string;
    isEncrypted: boolean;
    abstract getData(): any;
    decrypt(result: any): any;
    execute(publicKey: string, privateKey?: string): Promise<any>;
    getEndPoint(): string;
}
//# sourceMappingURL=Query.d.ts.map