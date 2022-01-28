import { Constants } from '../../utils/constants'
import { validationRules } from '../../utils/validation'
import { SignedTransaction } from './SignedTransaction'

export class TransferFioAddress extends SignedTransaction {
    public ENDPOINT: string = 'chain/transfer_fio_address'
    public ACTION: string = 'xferaddress'
    public ACCOUNT: string = Constants.defaultAccount
    public fioAddress: string
    public newOwnerKey: string
    public maxFee: number
    public technologyProviderId: string

    constructor(fioAddress: string, newOwnerKey: string, maxFee: number, technologyProviderId: string = '') {
        super()
        this.fioAddress = fioAddress
        this.newOwnerKey =  newOwnerKey
        this.maxFee = maxFee
        this.technologyProviderId = technologyProviderId

        this.validationData = { fioAddress, tpid: technologyProviderId || null }
        this.validationRules = validationRules.registerFioAddress
    }

    public getData(): any {
        const actor = this.getActor()
        const data = {
            fio_address: this.fioAddress,
            new_owner_fio_public_key: this.newOwnerKey,
            actor,
            tpid: this.technologyProviderId,
            max_fee: this.maxFee,
        }
        return data
    }
}
