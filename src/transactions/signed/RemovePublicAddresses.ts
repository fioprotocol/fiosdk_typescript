import {Account, Action, EndPoint, PublicAddress, RemovePublicAddressesResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Transactions'
import { SignedTransaction } from './SignedTransaction'

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

export class RemovePublicAddresses extends SignedTransaction<
    RemovePublicAddressesRequestData,
    RemovePublicAddressesResponse
> {
    public ENDPOINT = `chain/${EndPoint.removePublicAddress}` as const
    public ACTION = Action.removeAddress
    public ACCOUNT = Account.address

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
