import {RegisterFioDomainResponse} from '../../entities'
import {Constants} from '../../utils/constants'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type RegisterFioDomainRequestProps = {
    fioDomain: string
    maxFee: number
    ownerPublicKey?: string
    technologyProviderId: string,
}

export type RegisterFioDomainRequestData = {
    actor: string
    fio_domain: string
    max_fee: number
    owner_fio_public_key: string
    tpid: string,
}

export class RegisterFioDomainRequest extends SignedRequest<RegisterFioDomainRequestData, RegisterFioDomainResponse> {
    public ENDPOINT = 'chain/register_fio_domain'
    public ACTION = 'regdomain'
    public ACCOUNT = Constants.defaultAccount

    constructor(config: RequestConfig, public props: RegisterFioDomainRequestProps) {
        super(config)

        this.validationData = {fioDomain: props.fioDomain, tpid: props.technologyProviderId}
        this.validationRules = validationRules.registerFioDomain
    }

    public getData = () => ({
        actor: this.getActor(),
        fio_domain: this.props.fioDomain,
        max_fee: this.props.maxFee,
        owner_fio_public_key: this.props.ownerPublicKey || this.publicKey,
        tpid: this.props.technologyProviderId,
    })

}
