import {Account, Action, EndPoint, RegisterFioDomainResponse} from '../../entities'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Transactions'
import { SignedTransaction } from './SignedTransaction'

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

export class RegisterFioDomain extends SignedTransaction<RegisterFioDomainRequestData, RegisterFioDomainResponse> {
    public ENDPOINT = `chain/${EndPoint.registerFioDomain}` as const
    public ACTION = Action.regDomain
    public ACCOUNT = Account.address

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
