import {Account, Action, AddBundledTransactionsResponse, EndPoint} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type AddBundledTransactionsRequestProps = {
    fioAddress: string;
    bundleSets: number;
    maxFee: number;
    technologyProviderId: string
}

export type AddBundledTransactionsRequestData = {
    actor: any;
    bundle_sets: number;
    fio_address: string;
    max_fee: number;
    tpid: string;
}

export class AddBundledTransactionsRequest extends SignedRequest<
    AddBundledTransactionsRequestData,
    AddBundledTransactionsResponse
> {
    public ENDPOINT = `chain/${EndPoint.addBundledTransactions}` as const
    public ACTION = Action.addBundledTransactions
    public ACCOUNT = Account.address

    constructor(config: RequestConfig, public props: AddBundledTransactionsRequestProps) {
        super(config)

        this.validationData = {fioAddress: props.fioAddress, tpid: props.technologyProviderId}
        this.validationRules = validationRules.registerFioAddress
    }

    public getData = () => ({
        actor: this.getActor(),
        bundle_sets: this.props.bundleSets,
        fio_address: this.props.fioAddress,
        max_fee: this.props.maxFee,
        tpid: this.props.technologyProviderId,
    })
}
