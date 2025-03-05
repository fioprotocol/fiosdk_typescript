import {Account, Action, BurnFioAddressResponse, EndPoint} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Transactions'
import { SignedTransaction } from './SignedTransaction'

export type BurnFioAddressRequestProps = {
    fioAddress: string;
    maxFee: number;
    technologyProviderId: string;
}

export type BurnFioAddressRequestData = {
    fio_address: string;
    actor: string;
    tpid: string;
    max_fee: number;
}

export class BurnFioAddress extends SignedTransaction<BurnFioAddressRequestData, BurnFioAddressResponse> {
    public ENDPOINT = `chain/${EndPoint.burnFioAddress}` as const
    public ACTION = Action.burnAddress
    public ACCOUNT = Account.address

    constructor(config: RequestConfig, public props: BurnFioAddressRequestProps) {
        super(config)

        this.validationData = {fioAddress: props.fioAddress, tpid: props.technologyProviderId}
        this.validationRules = validationRules.registerFioAddress
    }

    public getData = () => ({
        actor: this.getActor(),
        fio_address: this.props.fioAddress,
        max_fee: this.props.maxFee,
        tpid: this.props.technologyProviderId,
    })
}
