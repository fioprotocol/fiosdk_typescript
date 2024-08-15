import {TransferTokensResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type TransferTokensRequestProps = {
    payeeFioPublicKey: string
    amount: number
    maxFee: number
    technologyProviderId: string,
}

export type TransferTokensRequestData = {
    actor: string
    // TODO why amount is string?
    amount: string
    max_fee: number
    payee_public_key: string
    tpid: string,
}

export class TransferTokensRequest extends SignedRequest<TransferTokensRequestData, TransferTokensResponse> {
    public ENDPOINT = 'chain/transfer_tokens_pub_key'
    public ACTION = 'trnsfiopubky'
    public ACCOUNT = 'fio.token'

    // TODO if change amount from type string to number remove
    public props: ReturnType<TransferTokensRequest['getResolvedProps']>

    constructor(config: RequestConfig, props: TransferTokensRequestProps) {
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

    private getResolvedProps = (props: TransferTokensRequestProps) => ({
        ...props,
        // TODO why amount is string?
        amount: `${props.amount}`,
    })
}
