import {Account, Action, EndPoint, TransferTokensResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Transactions'
import { SignedTransaction } from './SignedTransaction'

export type TransferTokensKeyRequestProps = {
    payeeFioPublicKey: string
    amount: number
    maxFee: number
    technologyProviderId: string,
}

export type TransferTokensKeyRequestData = {
    actor: string
    amount: number
    max_fee: number
    payee_public_key: string
    tpid: string,
}

export class TransferTokens extends SignedTransaction<TransferTokensKeyRequestData, TransferTokensResponse> {
    public ENDPOINT = `chain/${EndPoint.transferTokensPublicKey}` as const
    public ACTION = Action.transferTokensKey
    public ACCOUNT = Account.token

    constructor(config: RequestConfig, private props: TransferTokensKeyRequestProps) {
        super(config)

        this.validationData = {tpid: props.technologyProviderId}
        this.validationRules = validationRules.transferTokens
    }

    public prepareResponse(result: any): any {
        if (!result.processed) {
            return result
        }

        const apiResponse = SignedTransaction.parseProcessedResult(result.processed)
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
}
