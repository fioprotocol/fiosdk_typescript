import {BurnFioAddressResponse} from '../../entities'
import {Constants} from '../../utils/constants'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

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

export class BurnFioAddressRequest extends SignedRequest<BurnFioAddressRequestData, BurnFioAddressResponse> {
    public ENDPOINT = 'chain/burn_fio_address'
    public ACTION = 'burnaddress'
    public ACCOUNT = Constants.defaultAccount

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
