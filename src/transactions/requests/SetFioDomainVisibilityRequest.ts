import {SetFioDomainVisibilityResponse} from '../../entities'
import {Constants} from '../../utils/constants'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type SetFioDomainVisibilityRequestProps = {
    fioDomain: string
    isPublic: boolean
    maxFee: number
    technologyProviderId: string,
}

export type SetFioDomainVisibilityRequestData = {
    fio_domain: string
    is_public: 0 | 1
    max_fee: number
    tpid: string
    actor: string,
}

export class SetFioDomainVisibilityRequest extends SignedRequest<
    SetFioDomainVisibilityRequestData,
    SetFioDomainVisibilityResponse
> {
    public ENDPOINT = 'chain/set_fio_domain_public'
    public ACTION = 'setdomainpub'
    public ACCOUNT = Constants.defaultAccount

    constructor(config: RequestConfig, public props: SetFioDomainVisibilityRequestProps) {
        super(config)

        this.validationData = {fioDomain: props.fioDomain, tpid: props.technologyProviderId}
        this.validationRules = validationRules.registerFioDomain
    }

    public getData = () => ({
        actor: this.getActor(),
        fio_domain: this.props.fioDomain,
        is_public: this.props.isPublic ? 1 as const : 0 as const,
        max_fee: this.props.maxFee,
        tpid: this.props.technologyProviderId,
    })
}
