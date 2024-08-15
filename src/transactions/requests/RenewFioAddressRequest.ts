import {RenewFioAddressResponse} from '../../entities'
import {Constants} from '../../utils/constants'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type RenewFioAddressRequestProps = {
    fioAddress: string
    maxFee: number
    technologyProviderId: string,
}

export type RenewFioAddressRequestData = {
    fio_address: string
    max_fee: number
    tpid: string
    actor: string,
}

export class RenewFioAddressRequest extends SignedRequest<RenewFioAddressRequestData, RenewFioAddressResponse> {
    public ENDPOINT = 'chain/renew_fio_address'
    public ACTION = 'renewaddress'
    public ACCOUNT = Constants.defaultAccount

    constructor(config: RequestConfig, public props: RenewFioAddressRequestProps) {
        super(config)

        this.validationData = {fioAddress: props.fioAddress, tpid: props.technologyProviderId}
        this.validationRules = validationRules.renewFioAddress
    }

    public getData = () => ({
        actor: this.getActor(),
        fio_address: this.props.fioAddress,
        max_fee: this.props.maxFee,
        tpid: this.props.technologyProviderId,
    })
}
