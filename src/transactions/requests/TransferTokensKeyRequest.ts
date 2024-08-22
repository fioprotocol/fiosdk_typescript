import {Account, Action, EndPoint, TransferTokensKeyResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type TransferTokensKeyRequestProps = {
    payeeFioPublicKey: string
    amount: number
    maxFee: number
    technologyProviderId: string,
}

export type TransferTokensKeyRequestData = {
    actor: string
    // TODO why amount is string?
    amount: string
    max_fee: number
    payee_public_key: string
    tpid: string,
}

export class TransferTokensKeyRequest extends SignedRequest<TransferTokensKeyRequestData, TransferTokensKeyResponse> {
    public ENDPOINT = `chain/${EndPoint.transferTokensKey}` as const
    public ACTION = Action.transferTokensKey
    public ACCOUNT = Account.token

    // TODO if change amount from type string to number remove
    public props: ReturnType<TransferTokensKeyRequest['getResolvedProps']>

    constructor(config: RequestConfig, props: TransferTokensKeyRequestProps) {
        super(config)

        this.props = this.getResolvedProps(props)

        this.validationData = {tpid: props.technologyProviderId}
        this.validationRules = validationRules.transferTokens
    }

    public prepareResponse(result: any): any {
        if (!result.processed) {
            return result
        }

        const apiResponse = SignedRequest.parseProcessedResult(result.processed)
        return {
            block_num: result.processed.block_num,
            transaction_id: result.transaction_id,
            ...apiResponse,
        }
    }

    public getData = () => ({
        actor: this.getActor(),
        amount: this.props.amount,
        max_fee: this.props.maxFee,
        payee_public_key: this.props.payeeFioPublicKey,
        tpid: this.props.technologyProviderId,
    })

    private getResolvedProps = (props: TransferTokensKeyRequestProps) => ({
        ...props,
        // TODO why amount is string?
        amount: `${props.amount}`,
    })
}
