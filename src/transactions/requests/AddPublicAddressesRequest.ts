import {AddPublicAddressesResponse, PublicAddress} from '../../entities'
import {Constants} from '../../utils/constants'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type AddPublicAddressesRequestProps = {
    fioAddress: string;
    publicAddresses: PublicAddress[];
    maxFee: number;
    technologyProviderId: string;
}

export type AddPublicAddressesRequestData = {
    actor: string;
    fio_address: string;
    public_addresses: PublicAddress[];
    tpid: string,
    max_fee: number
}

export class AddPublicAddressesRequest extends SignedRequest<AddPublicAddressesRequestData, AddPublicAddressesResponse> {
    public ENDPOINT = 'chain/add_pub_address'
    public ACTION = 'addaddress'
    public ACCOUNT = Constants.defaultAccount

    constructor(config: RequestConfig, public props: AddPublicAddressesRequestProps) {
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
