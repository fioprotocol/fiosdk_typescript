import { Transactions } from '../Transactions'
import { Constants } from '../../utils/constants'

export abstract class SignedTransaction extends Transactions {

  public static prepareResponse(
    result: {
      transaction_id: string,
      processed: {
        block_num: number,
        action_traces: Array<{ receipt: { response: string }}>,
      },
    } | any,
    includeTrxId: boolean = false,
  ): any {
    if (result.processed) {
      const processed = SignedTransaction.parseProcessedResult(result.processed)
      return {
          block_num: result.processed.block_num,
          block_time: result.processed.block_time,
          transaction_id: result.transaction_id,
          ...processed,
        }

    }
    return result
  }

  public static parseProcessedResult(processed: { action_traces: Array<{ receipt: { response: string }}>}) {
    try {
      if (!processed.action_traces[0].receipt.response || typeof processed.action_traces[0].receipt.response !== 'object') return {}
      return JSON.parse(processed.action_traces[0].receipt.response)
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(e)
    }

    return {}
  }

  public abstract ENDPOINT: string
  public abstract ACTION: string
  public abstract ACCOUNT: string

  public abstract getData(): any

  public static authPermission: string | undefined
  public static signingAccount: string | undefined
  public static expirationOffset: number

  public async execute(privateKey: string, publicKey: string, dryRun = false, expirationOffset = Constants.defaultExpirationOffset): Promise<any> {
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

  public prepareResponse(result: { processed: { action_traces: Array<{ receipt: { response: string }}>} } | any): any {
    return SignedTransaction.prepareResponse(result)
  }

  public getAction(): string {
    return this.ACTION
  }

  public getAccount(): string {
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
