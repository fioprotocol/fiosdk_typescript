import { Account, Action, EndPoint } from '../../entities';
import { Transactions } from '../Transactions';
export declare abstract class SignedTransaction<T = any, R = any> extends Transactions {
    static prepareResponse(result: {
        transaction_id: string;
        processed: {
            block_num: number;
            action_traces: Array<{
                receipt: {
                    response: string;
                };
            }>;
        };
    } | any, includeTrxId?: boolean): any;
    static parseProcessedResult(processed: {
        action_traces: Array<{
            receipt: {
                response: string;
            };
        }>;
    }): any;
    protected abstract ENDPOINT: `chain/${EndPoint}`;
    protected abstract ACTION: Action;
    protected abstract ACCOUNT: Account;
    abstract getData(): T;
    execute(privateKey: string, publicKey: string, dryRun?: boolean, expirationOffset?: number): Promise<R>;
    prepareResponse(result: {
        processed: {
            action_traces: Array<{
                receipt: {
                    response: string;
                };
            }>;
        };
    } | any): R;
    getAction(): Action;
    getAccount(): Account;
    getAuthPermission(): string | undefined;
    getSigningAccount(): string | undefined;
    getEndPoint(): string;
}
//# sourceMappingURL=SignedTransaction.d.ts.map