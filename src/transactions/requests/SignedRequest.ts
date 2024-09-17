import {Account, Action, EndPoint} from '../../entities'
import {defaultExpirationOffset} from '../../utils/constants'
import {Request} from '../Request'

export abstract class SignedRequest<T = any, R = any> extends Request {
    public static prepareResponse(
        result: {
            transaction_id: string,
            processed: {
                block_num: number,
                action_traces: Array<{ receipt: { response: string } }>,
            },
        } | any,
        includeTrxId: boolean = false,
    ) {
        if (!result.processed) {
            return result
        }
        const processed = SignedRequest.parseProcessedResult(result.processed)
        return {
            block_num: result.processed.block_num,
            block_time: result.processed.block_time,
            transaction_id: result.transaction_id,
            ...processed,
        }
    }

    public static parseProcessedResult(processed: { action_traces: Array<{ receipt: { response: string } }> }) {
        try {
            if (!processed.action_traces[0].receipt.response) {
                return {}
            }
            return JSON.parse(processed.action_traces[0].receipt.response)
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.error(e)
        }

        return {}
    }

    protected abstract ENDPOINT: `chain/${EndPoint}`
    protected abstract ACTION: Action
    protected abstract ACCOUNT: Account

    public abstract getData(): T

    public async execute(
        privateKey: string,
        publicKey: string,
        dryRun = false,
        expirationOffset = defaultExpirationOffset,
    ): Promise<R> {
        this.privateKey = privateKey
        this.publicKey = publicKey
        this.expirationOffset = expirationOffset

        const rawTransaction = await this.createRawTransaction({
            account: this.getAccount(),
            action: this.getAction(),
            authPermission: this.getAuthPermission(),
            data: this.getData(),
            signingAccount: this.getSigningAccount(),
        })

        const result = await this.pushToServer(rawTransaction, this.getEndPoint(), dryRun)

        return this.prepareResponse(result)
    }

    public prepareResponse(result: {
        processed: { action_traces: Array<{ receipt: { response: string } }> },
    } | any): R {
        return SignedRequest.prepareResponse(result)
    }

    public getAction(): Action {
        return this.ACTION
    }

    public getAccount(): Account {
        return this.ACCOUNT
    }

    public getAuthPermission(): string | undefined {
        return this.authPermission
    }

    public getSigningAccount(): string | undefined {
        return this.signingAccount
    }

    public getEndPoint(): string {
        return this.ENDPOINT
    }
}
