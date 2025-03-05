import {Account, Action, EndPoint, SetFioDomainVisibilityResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Transactions'
import { SignedTransaction } from './SignedTransaction'

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

export class SetFioDomainVisibility extends SignedTransaction<
    SetFioDomainVisibilityRequestData,
    SetFioDomainVisibilityResponse
> {
    public ENDPOINT = `chain/${EndPoint.setFioDomainPublic}` as const
    public ACTION = Action.setDomainPublic
    public ACCOUNT = Account.address

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
