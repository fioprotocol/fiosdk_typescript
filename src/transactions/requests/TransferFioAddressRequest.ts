import {Account, Action, EndPoint, TransferFioAddressResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type TransferFioAddressRequestProps = {
    fioAddress: string
    newOwnerKey: string
    maxFee: number
    technologyProviderId: string,
}

export type TransferFioAddressRequestData = {
    fio_address: string
    new_owner_fio_public_key: string
    actor: string
    tpid: string
    max_fee: number,
}

export class TransferFioAddressRequest extends SignedRequest<
    TransferFioAddressRequestData,
    TransferFioAddressResponse
> {
    public ENDPOINT = `chain/${EndPoint.transferFioAddress}` as const
    public ACTION = Action.transferAddress
    public ACCOUNT = Account.address

    constructor(config: RequestConfig, public props: TransferFioAddressRequestProps) {
        super(config)

        this.validationData = {fioAddress: props.fioAddress, tpid: props.technologyProviderId}
        this.validationRules = validationRules.registerFioAddress
    }

    public getData = () => ({
        actor: this.getActor(),
        fio_address: this.props.fioAddress,
        max_fee: this.props.maxFee,
        new_owner_fio_public_key: this.props.newOwnerKey,
        tpid: this.props.technologyProviderId,
    })
}
