import {Account, Action, EncryptOptions, EndPoint} from '../../entities'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type PushRequestProps = {
    action: Action;
    account?: Account;
    data: any;
    encryptOptions: EncryptOptions;
    authPermission: string | undefined;
    signingAccount: string | undefined;
}

// TODO add typings
export class PushRequest extends SignedRequest {
    public ENDPOINT = `chain/${EndPoint.pushTransaction}` as const
    // TODO optimize type
    public ACTION: Action
    public ACCOUNT = Account.address

    constructor(config: RequestConfig, public props: PushRequestProps) {
        super(config)

        this.ACTION = props.action
        if (props.account) {
            this.ACCOUNT = props.account
        }

        // TODO No validation?
    }

    public getData() {
        const data = {...this.props.data}

        const {encryptOptions} = this.props

        if (data.content
            && encryptOptions
            && encryptOptions.publicKey
            && encryptOptions.contentType) {
            data.content = this.getCipherContent(
                encryptOptions.contentType,
                data.content,
                encryptOptions.privateKey || this.privateKey,
                encryptOptions.publicKey,
            )
        }

        return {
            ...data,
            actor:
                this.props.data.actor != null
                && this.props.data.actor !== ''
                    ? this.props.data.actor
                    : this.getActor(),
        }
    }

}
