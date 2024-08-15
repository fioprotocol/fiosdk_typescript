import {RenewFioDomainResponse} from '../../entities'
import {Constants} from '../../utils/constants'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type RenewFioDomainRequestProps = {
    fioDomain: string
    maxFee: number
    technologyProviderId: string,
}

export type RenewFioDomainRequestData = {
    fio_domain: string
    max_fee: number
    tpid: string
    actor: string,
}

export class RenewFioDomainRequest extends SignedRequest<RenewFioDomainRequestData, RenewFioDomainResponse> {
    public ENDPOINT = 'chain/renew_fio_domain'
    public ACTION = 'renewdomain'
    public ACCOUNT = Constants.defaultAccount

    constructor(config: RequestConfig, public props: RenewFioDomainRequestProps) {
        super(config)

        this.validationData = {fioDomain: props.fioDomain, tpid: props.technologyProviderId}
        this.validationRules = validationRules.renewFioDomain
    }

    public getData = () => ({
        actor: this.getActor(),
        fio_domain: this.props.fioDomain,
        max_fee: this.props.maxFee,
        tpid: this.props.technologyProviderId,
    })

}
