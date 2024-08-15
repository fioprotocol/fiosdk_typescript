import {TransferFioDomainResponse} from '../../entities'
import { Constants } from '../../utils/constants'
import { validationRules } from '../../utils/validation'
import {RequestConfig} from '../Request'
import { SignedRequest } from './SignedRequest'

export type TransferFioDomainRequestProps = {
    fioDomain: string
    newOwnerKey: string
    maxFee: number
    technologyProviderId: string,
}

export type TransferFioDomainRequestData = {
    actor: string,
    fio_domain: string
    max_fee: number
    new_owner_fio_public_key: string
    tpid: string,
}

export class TransferFioDomainRequest extends SignedRequest<TransferFioDomainRequestData, TransferFioDomainResponse> {
    public ENDPOINT = 'chain/transfer_fio_domain'
    public ACTION = 'xferdomain'
    public ACCOUNT = Constants.defaultAccount

    constructor(config: RequestConfig, public props: TransferFioDomainRequestProps) {
        super(config)

        this.validationData = { fioDomain: props.fioDomain, tpid: props.technologyProviderId }
        this.validationRules = validationRules.registerFioDomain
    }

    public getData = () => ({
        actor: this.getActor(),
        fio_domain: this.props.fioDomain,
        max_fee: this.props.maxFee,
        new_owner_fio_public_key: this.props.newOwnerKey,
        tpid: this.props.technologyProviderId,
    })
}
