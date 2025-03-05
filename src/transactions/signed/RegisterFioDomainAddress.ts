import {Account, Action, EndPoint, RegisterFioAddressResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Transactions'
import { SignedTransaction } from './SignedTransaction'

export type RegisterFioDomainAddressRequestProps = {
    fioAddress: string;
    maxFee: number;
    isPublic?: boolean;
    ownerPublicKey?: string;
    technologyProviderId: string;
}

export type RegisterFioDomainAddressRequestData = {
    actor: string
    fio_address: string
    is_public: 0 | 1
    max_fee: number,
    owner_fio_public_key: string,
    tpid: string,
}

export class RegisterFioDomainAddress extends SignedTransaction<
    RegisterFioDomainAddressRequestData,
    RegisterFioAddressResponse
> {
    public ENDPOINT = `chain/${EndPoint.registerFioDomainAddress}` as const
    public ACTION = Action.regDomainAddress
    public ACCOUNT = Account.address

    constructor(config: RequestConfig, public props: RegisterFioDomainAddressRequestProps) {
        super(config)

        this.validationData = {fioAddress: props.fioAddress, tpid: props.technologyProviderId}
        this.validationRules = validationRules.registerFioDomainAddress
    }

    public getData = () => ({
        actor: this.getActor(),
        fio_address: this.props.fioAddress,
        is_public: this.props.isPublic ? 1 as const : 0 as const,
        max_fee: this.props.maxFee,
        owner_fio_public_key: this.props.ownerPublicKey || this.publicKey,
        tpid: this.props.technologyProviderId,
    })
}
