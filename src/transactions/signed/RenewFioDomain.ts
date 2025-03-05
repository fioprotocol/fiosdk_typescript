import {Account, Action, EndPoint, RenewFioDomainResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Transactions'
import { SignedTransaction } from './SignedTransaction'

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

export class RenewFioDomain extends SignedTransaction<RenewFioDomainRequestData, RenewFioDomainResponse> {
    public ENDPOINT = `chain/${EndPoint.renewFioDomain}` as const
    public ACTION = Action.renewDomain
    public ACCOUNT = Account.address

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
