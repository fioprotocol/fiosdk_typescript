import { Transactions } from '../Transactions'

export abstract class Query<T> extends Transactions {
  public abstract ENDPOINT: string

  public isEncrypted = false

  public requestTimeout = 5000

  public abstract getData(): any

  public decrypt(result: any): any {
  }

  public async execute(publicKey: string, privateKey: string = ''): Promise<any> {
    this.publicKey = publicKey
    this.privateKey = privateKey
    if (!this.isEncrypted) {
      try {
        return this.multicastServers({ endpoint: this.getEndPoint(), body: JSON.stringify(this.getData()), requestTimeout: this.requestTimeout })
      } catch (error) {
        throw error
      }
    } else {
      try {
        const result = await this.multicastServers({ endpoint: this.getEndPoint(), body: JSON.stringify(this.getData()), requestTimeout: this.requestTimeout })
        return await this.decrypt(result)
      } catch (error) {
        throw error
      }
    }
  }

  public getEndPoint(): string {
    return this.ENDPOINT
  }

}
