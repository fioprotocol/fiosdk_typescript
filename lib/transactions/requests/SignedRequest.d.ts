import { Request } from '../Request';
export declare abstract class SignedRequest<T = any, R = any> extends Request {
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
    protected abstract ENDPOINT: string;
    protected abstract ACTION: string;
    protected abstract ACCOUNT: string;
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
    getAction(): string;
    getAccount(): string;
    getAuthPermission(): string | undefined;
    getSigningAccount(): string | undefined;
    getEndPoint(): string;
}
//# sourceMappingURL=SignedRequest.d.ts.map