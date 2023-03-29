import { Transactions } from '../Transactions'

export abstract class Query<T> extends Transactions {
  public abstract ENDPOINT: string

  public isEncrypted = false

  public abstract getData(): any

  public decrypt(result: any): any {
  }

  public async execute(publicKey: string, privateKey: string = ''): Promise<any> {
    this.publicKey = publicKey
    this.privateKey = privateKey
    if (!this.isEncrypted) {
      try {
        return this.multicastServers(this.getEndPoint(), JSON.stringify(this.getData()))
      } catch (error) {
        throw error
      }
    } else {
      try {
        const result = await this.multicastServers(this.getEndPoint(), JSON.stringify(this.getData()))
        return this.decrypt(result)
      } catch (error) {
        throw error
      }
    }
  }

  public getEndPoint(): string {
    return this.ENDPOINT
  }

}
