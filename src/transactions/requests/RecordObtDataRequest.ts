import {
    Account,
    Action,
    ContentType,
    EndPoint, FioSentItemContent,
    RecordObtDataResponse,
    RequestStatus,
} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type RecordObtDataRequestData = {
    payer_fio_address: string;
    payee_fio_address: string;
    content: string;
    fio_request_id?: number;
    max_fee: number;
    actor: string;
    tpid: string;
}

export type RecordObtDataRequestProps = {
    amount: number,
    chainCode: string,
    encryptPrivateKey?: string,
    fioRequestId?: number,
    hash?: string,
    maxFee: number,
    memo?: string,
    obtId: string,
    offLineUrl?: string,
    payeeFioAddress: string,
    payerFioAddress: string,
    payeeTokenPublicAddress: string,
    payerTokenPublicAddress: string,
    payeeFioPublicKey?: string,
    status?: RequestStatus,
    technologyProviderId: string,
    tokenCode: string,
}

export class RecordObtDataRequest extends SignedRequest<RecordObtDataRequestData, RecordObtDataResponse> {
    public ENDPOINT = `chain/${EndPoint.recordObtData}` as const
    public ACTION = Action.recordObt
    public ACCOUNT = Account.reqObt

    public props: ReturnType<RecordObtDataRequest['getResolvedProps']>

    constructor(config: RequestConfig, props: RecordObtDataRequestProps) {
        super(config)

        this.props = this.getResolvedProps(props)

        this.validationData = {
            payeeFioAddress: this.props.payeeFioAddress,
            payerFioAddress: this.props.payerFioAddress,
            tokenCode: this.props.tokenCode,
            tpid: this.props.technologyProviderId,
        }
        this.validationRules = validationRules.recordObtData
    }

    public getData = () => ({
        actor: this.getActor(),
        content: this.getCipherContent(
            ContentType.recordObtDataContent,
            this.getResolvedContent(),
            this.props.encryptPrivateKey || this.privateKey,
            this.props.payeeFioPublicKey,
        ),
        fio_request_id: this.props.fioRequestId,
        max_fee: this.props.maxFee,
        payee_fio_address: this.props.payeeFioAddress,
        payer_fio_address: this.props.payerFioAddress,
        tpid: this.props.technologyProviderId,
    })

    public getResolvedContent = (): FioSentItemContent => ({
        amount: `${this.props.amount}`,
        chain_code: this.props.chainCode,
        hash: this.props.hash,
        memo: this.props.memo,
        obt_id: this.props.obtId,
        offline_url: this.props.offLineUrl,
        payee_public_address: this.props.payeeTokenPublicAddress,
        payer_public_address: this.props.payerTokenPublicAddress,
        status: this.props.status,
        token_code: this.props.tokenCode,
    })

    public getResolvedProps = (props: RecordObtDataRequestProps) => ({
        ...props,
        encryptPrivateKey: props.encryptPrivateKey ?? null,
        hash: props.hash ?? null,
        memo: props.memo ?? null,
        offLineUrl: props.offLineUrl ?? null,
        payeeFioPublicKey: props.payeeFioPublicKey ?? '',
        status: props.status ?? RequestStatus.sentToBlockchain,
    })

}
