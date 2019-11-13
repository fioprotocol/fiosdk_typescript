import { Autorization } from '../../entities/Autorization'
import { RawAction } from '../../entities/RawAction'
import { RawTransaction } from '../../entities/RawTransaction'
import { Transactions } from '../Transactions'

export abstract class SignedTransaction extends Transactions {
  public abstract ENDPOINT: string
  public abstract ACTION: string
  public abstract ACCOUNT: string

  public abstract getData(): any

  public async execute(privateKey: string, publicKey: string, dryRun = false): Promise<any> {
    this.privateKey = privateKey
    this.publicKey = publicKey

    const rawTransaction = new RawTransaction()
    const rawaction = new RawAction()
    rawaction.account = this.getAccount()
    const actor = await this.getActor()

    rawaction.authorization.push(new Autorization(actor))
    rawaction.account = this.getAccount()
    rawaction.name = this.getAction()
    rawaction.data = this.getData()
    rawTransaction.actions.push(rawaction)
    const result = await this.pushToServer(rawTransaction, this.getEndPoint(), dryRun)
    return this.prepareResponse(result)
  }

  public prepareResponse(result: any): any {
    if (result.processed)
      return this.parseProcessedResult(result.processed)
    return result
  }

  public parseProcessedResult(processed: any) {
    return JSON.parse(processed.action_traces[0].receipt.response)
  }

  public getAction(): string {
    return this.ACTION
  }

  public getAccount(): string {
    return this.ACCOUNT
  }

  public getEndPoint(): string {
    return this.ENDPOINT
  }
}
