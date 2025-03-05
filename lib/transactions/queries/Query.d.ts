import { EndPoint } from '../../entities';
import { Transactions } from '../Transactions';
export declare abstract class Query<T = any, R = any> extends Transactions {
    abstract ENDPOINT: `chain/${EndPoint}`;
    isEncrypted: boolean;
    requestTimeout: number;
    abstract getData(): T;
    execute(publicKey: string, privateKey?: string): Promise<R>;
    decrypt(result: any): Promise<R>;
    getEndPoint(): string;
}
//# sourceMappingURL=Query.d.ts.map