import {Account, Action, EncryptOptions, EndPoint} from '../../entities'
import {RequestConfig} from '../Transactions'
import { SignedTransaction } from './SignedTransaction'

export type PushRequestProps = {
    action: Action;
    account?: Account;
    data: any;
    encryptOptions: EncryptOptions;
    authPermission: string | undefined;
    signingAccount: string | undefined;
}

export class PushTransaction extends SignedTransaction {
    public ENDPOINT = `chain/${EndPoint.pushTransaction}` as const
    public ACTION: Action
    public ACCOUNT = Account.address

    private readonly data: any
    private readonly encryptOptions: EncryptOptions

    constructor(config: RequestConfig, props: PushRequestProps) {
        super(config)

        this.ACTION = props.action

        if (props.account) {
            this.ACCOUNT = props.account
        }

        this.data = props.data
        this.encryptOptions = props.encryptOptions
        this.authPermission = props.authPermission
        this.signingAccount = props.signingAccount
    }

    public getData() {
        const data = {...this.data}

        if (data.content
            && this.encryptOptions
            && this.encryptOptions.publicKey
            && this.encryptOptions.contentType) {
            data.content = this.getCipherContent(
                this.encryptOptions.contentType,
                data.content,
                this.encryptOptions.privateKey || this.privateKey,
                this.encryptOptions.publicKey,
            )
        }

        if (data.actor === null || data.actor === '') {
            data.content = this.getActor()
        }

        return data
    }

}
