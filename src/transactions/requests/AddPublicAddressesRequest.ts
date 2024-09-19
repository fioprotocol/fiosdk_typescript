import {Account, Action, AddPublicAddressesResponse, EndPoint, PublicAddress} from '../../entities'
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

export class AddPublicAddressesRequest extends SignedRequest<
    AddPublicAddressesRequestData,
    AddPublicAddressesResponse
> {
    public ENDPOINT = `chain/${EndPoint.addPublicAddress}` as const
    public ACTION = Action.addPublicAddresses
    public ACCOUNT = Account.address

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
