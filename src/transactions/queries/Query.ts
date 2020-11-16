import { Transactions } from '../Transactions'

export abstract class Query<T> extends Transactions {
  abstract ENDPOINT: string

  abstract getData(): any

  decrypt(result: any): any {
  }

  isEncrypted = false

  async execute(publicKey: string, privateKey: string = ''): Promise<any> {
    this.publicKey = publicKey
    this.privateKey = privateKey
    if (!this.isEncrypted) {
      return this.multicastServers(this.getEndPoint(), JSON.stringify(this.getData()))
    } else {
      try {
        const result = await this.multicastServers(this.getEndPoint(), JSON.stringify(this.getData()))
        return this.decrypt(result)
      } catch (error) {
        throw error
      }
    }
  }

  getEndPoint(): string {
    return this.ENDPOINT
  }

}
