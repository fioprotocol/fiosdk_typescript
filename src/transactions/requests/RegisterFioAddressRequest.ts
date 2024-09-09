import {Account, Action, EndPoint, RegisterFioAddressResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type RegisterFioAddressRequestData = {
    fio_address: string;
    owner_fio_public_key: string;
    max_fee: number;
    tpid: string;
    actor: string;
}

export type RegisterFioAddressRequestProps = {
    fioAddress: string;
    maxFee: number;
    technologyProviderId: string;
    ownerPublicKey?: string;
}

export class RegisterFioAddressRequest extends SignedRequest<
    RegisterFioAddressRequestData,
    RegisterFioAddressResponse
> {
    public ENDPOINT = `chain/${EndPoint.registerFioAddress}` as const
    public ACTION = Action.regAddress
    public ACCOUNT = Account.address

    constructor(config: RequestConfig, public props: RegisterFioAddressRequestProps) {
        super(config)

        this.validationData = {fioAddress: props.fioAddress, tpid: props.technologyProviderId}
        this.validationRules = validationRules.registerFioAddress
    }

    public getData = () => ({
        actor: this.getActor(),
        fio_address: this.props.fioAddress,
        max_fee: this.props.maxFee,
        owner_fio_public_key: this.props.ownerPublicKey || this.publicKey,
        tpid: this.props.technologyProviderId,
    })

}
