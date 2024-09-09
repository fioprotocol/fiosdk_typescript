import {Account, Action, EndPoint, RemoveAllPublicAddressesResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type RemoveAllPublicAddressesRequestProps = {
    fioAddress: string
    maxFee: number
    technologyProviderId: string,
}

export type RemoveAllPublicAddressesRequestData = {
    fio_address: string
    actor: string
    tpid: string
    max_fee: number,
}

export class RemoveAllPublicAddressesRequest extends SignedRequest<
    RemoveAllPublicAddressesRequestData,
    RemoveAllPublicAddressesResponse
> {
    public ENDPOINT = `chain/${EndPoint.removeAllPubAddresses}` as const
    public ACTION = Action.removeAllAddresses
    public ACCOUNT = Account.address

    constructor(config: RequestConfig, public props: RemoveAllPublicAddressesRequestProps) {
        super(config)

        this.validationData = {fioAddress: props.fioAddress, tpid: props.technologyProviderId}
        this.validationRules = validationRules.addPublicAddressRules
    }

    public getData = () => ({
        actor: this.getActor(),
        fio_address: this.props.fioAddress,
        max_fee: this.props.maxFee,
        tpid: this.props.technologyProviderId,
    })
}
