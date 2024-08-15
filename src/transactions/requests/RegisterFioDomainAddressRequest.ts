import {RegisterFioAddressResponse} from '../../entities'
import {Constants} from '../../utils/constants'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

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

export class RegisterFioDomainAddressRequest extends SignedRequest<
    RegisterFioDomainAddressRequestData,
    RegisterFioAddressResponse
> {
    public ENDPOINT = 'chain/register_fio_domain_address'
    public ACTION = 'regdomadd'
    public ACCOUNT = Constants.defaultAccount

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
