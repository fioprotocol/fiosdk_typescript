import { SignedTransaction } from './SignedTransaction'
import { Constants } from '../../utils/constants'
import { validationRules } from '../../utils/validation'

export class TransferFioDomain extends SignedTransaction {
    public ENDPOINT: string = 'chain/transfer_fio_domain'
    public ACTION: string = 'xferdomain'
    public ACCOUNT: string = Constants.defaultAccount
    public fioDomain: string
    public newOwnerKey: string
    public maxFee: number
    public technologyProviderId: string

    constructor(fioDomain: string, newOwnerKey: string, maxFee: number, technologyProviderId: string = '') {
        super()
        this.fioDomain = fioDomain
        this.newOwnerKey =  newOwnerKey
        this.maxFee = maxFee
        this.technologyProviderId = technologyProviderId

        this.validationData = { fioDomain, tpid: technologyProviderId || null }
        this.validationRules = validationRules.registerFioDomain
    }

    public getData(): any {
        const actor = this.getActor()
        const data = {
            fio_domain: this.fioDomain,
            new_owner_fio_public_key: this.newOwnerKey,
            actor,
            tpid: this.technologyProviderId,
            max_fee: this.maxFee,
        }
        return data
    }
}
