import {EndPoint} from '../../entities'
import {Request} from '../Request'

export abstract class Query<T = any, R = any> extends Request {
    public abstract ENDPOINT: `chain/${EndPoint}`

    public isEncrypted = false

    public requestTimeout = 5000

    public abstract getData(): T

    public async execute(publicKey: string, privateKey: string = ''): Promise<R> {
        this.publicKey = publicKey
        this.privateKey = privateKey

        if (!this.isEncrypted) {
            try {
                return this.multicastServers({
                    body: JSON.stringify(this.getData()),
                    endpoint: this.getEndPoint(),
                    requestTimeout: this.requestTimeout,
                })
            } catch (error) {
                throw error
            }
        } else {
            try {
                const result = await this.multicastServers({
                    body: JSON.stringify(this.getData()),
                    endpoint: this.getEndPoint(),
                    requestTimeout: this.requestTimeout,
                })
                // TODO if decrypt result undefined return result as default
                return await this.decrypt(result)
            } catch (error) {
                throw error
            }
        }
    }

    public async decrypt(result: any): Promise<R> {
        throw new Error('Not implemented')
    }

    public getEndPoint(): string {
        return this.ENDPOINT
    }
}
