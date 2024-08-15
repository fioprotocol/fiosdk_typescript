import {PublicAddress, RemovePublicAddressesResponse} from '../../entities'
import {Constants} from '../../utils/constants'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type RemovePublicAddressesRequestProps = {
    fioAddress: string
    publicAddresses: PublicAddress[]
    maxFee: number
    technologyProviderId: string,
}

export type RemovePublicAddressesRequestData = {
    actor: string
    fio_address: string
    max_fee: number
    public_addresses: PublicAddress[]
    tpid: string,
}

export class RemovePublicAddressesRequest extends SignedRequest<
    RemovePublicAddressesRequestData,
    RemovePublicAddressesResponse
> {
    public ENDPOINT = 'chain/remove_pub_address'
    public ACTION = 'remaddress'
    public ACCOUNT = Constants.defaultAccount

    constructor(config: RequestConfig, public props: RemovePublicAddressesRequestProps) {
        super(config)

        this.validationData = {fioAddress: props.fioAddress, tpid: props.technologyProviderId}
        this.validationRules = validationRules.addPublicAddressRules
    }

    public getData = () => ({
        actor: this.getActor(),
        fio_address: this.props.fioAddress,
        max_fee: this.props.maxFee,
        public_addresses: this.props.publicAddresses,
        tpid: this.props.technologyProviderId,
    })
}
