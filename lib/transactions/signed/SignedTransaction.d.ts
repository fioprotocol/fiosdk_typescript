import { Transactions } from '../Transactions';
export declare abstract class SignedTransaction extends Transactions {
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
    abstract ENDPOINT: string;
    abstract ACTION: string;
    abstract ACCOUNT: string;
    abstract getData(): any;
    execute(privateKey: string, publicKey: string, dryRun?: boolean): Promise<any>;
    prepareResponse(result: {
        processed: {
            action_traces: Array<{
                receipt: {
                    response: string;
                };
            }>;
        };
    } | any): any;
    getAction(): string;
    getAccount(): string;
    getEndPoint(): string;
}
//# sourceMappingURL=SignedTransaction.d.ts.map