import {Constants} from '../../utils/constants'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type EncryptOptions = { publicKey?: string; privateKey?: string; contentType?: string }

export type PushRequestProps = {
    // TODO create or use exist action enum
    action: string;
    // TODO create or use account enum
    account?: string;
    data: any;
    encryptOptions: EncryptOptions;
    authPermission: string | undefined;
    signingAccount: string | undefined;
}

// TODO add typings
export class PushRequest extends SignedRequest {
    public ENDPOINT = 'chain/push_transaction'
    public ACTION = ''
    public ACCOUNT = Constants.defaultAccount

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
