import {
    Account,
    Action,
    ContentType,
    EndPoint,
    FioSentItemContent,
    FundsRequestResponse,
    RequestStatus,
} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type FundsRequestRequestProps = {
    amount: number
    maxFee: number
    chainCode: string
    tokenCode: string,
    payeeFioAddress: string
    payerFioAddress: string
    payeeTokenPublicAddress: string
    payerFioPublicKey?: string
    hash?: string
    memo?: string
    offlineUrl?: string
    encryptPrivateKey?: string
    technologyProviderId: string,
}

export type FundsRequestRequestData = {
    actor: string
    content: string
    max_fee: number
    payee_fio_address: string
    payer_fio_address: string
    tpid: string,
}

export class FundsRequestRequest extends SignedRequest<
    FundsRequestRequestData,
    FundsRequestResponse
> {

    public ENDPOINT = `chain/${EndPoint.newFundsRequest}` as const
    public ACTION = Action.newFundsRequest
    public ACCOUNT = Account.reqObt

    public props: ReturnType<FundsRequestRequest['getResolvedProps']>
    public content: ReturnType<FundsRequestRequest['getResolvedContent']>

    constructor(config: RequestConfig, props: FundsRequestRequestProps) {
        super(config)

        this.props = this.getResolvedProps(props)
        this.content = this.getResolvedContent()

        this.validationData = {
            payeeFioAddress: this.props.payeeFioAddress,
            payerFioAddress: this.props.payerFioAddress,
            tokenCode: this.props.tokenCode,
            tpid: this.props.technologyProviderId,
        }
        this.validationRules = validationRules.newFundsRequest
    }

    public getData = () => ({
        actor: this.getActor(),
        content: this.getCipherContent(
            ContentType.newFundsContent,
            this.content,
            this.props.encryptPrivateKey || this.privateKey,
            this.props.payerFioPublicKey,
        ),
        max_fee: this.props.maxFee,
        payee_fio_address: this.props.payeeFioAddress,
        payer_fio_address: this.props.payerFioAddress,
        tpid: this.props.technologyProviderId,
    })

    public getResolvedProps = (props: FundsRequestRequestProps) => ({
        ...props,
        encryptPrivateKey: props.encryptPrivateKey ?? null,
        hash: props.hash ?? null,
        memo: props.memo ?? null,
        offlineUrl: props.offlineUrl ?? null,
        payerFioPublicKey: props.payerFioPublicKey ?? '',
    })

    public getResolvedContent = (): FioSentItemContent => ({
        amount: `${this.props.amount}`,
        chain_code: this.props.chainCode,
        hash: this.props.hash,
        memo: this.props.memo,
        offline_url: this.props.offlineUrl,
        payee_public_address: this.props.payeeTokenPublicAddress,
        status: RequestStatus.pending,
        token_code: this.props.tokenCode,
    })

}
