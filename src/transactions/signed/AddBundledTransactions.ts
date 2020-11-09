import { SignedTransaction } from './SignedTransaction'
import { Constants } from '../../utils/constants'
import { validationRules } from '../../utils/validation'

export class AddBundledTransactions extends SignedTransaction {
    public ENDPOINT: string = 'chain/burn_fio_address'
    public ACTION: string = 'addbundles'
    public ACCOUNT: string = Constants.defaultAccount
    public fioAddress: string
    public bundleSets: number
    public maxFee: number
    public technologyProviderId: string

    constructor(fioAddress: string, bundleSets: number, maxFee: number, technologyProviderId: string = '') {
        super()
        this.fioAddress = fioAddress
        this.bundleSets = bundleSets
        this.maxFee = maxFee
        this.technologyProviderId = technologyProviderId

        this.validationData = { fioAddress, tpid: technologyProviderId || null }
        this.validationRules = validationRules.registerFioAddress
    }

    public getData(): any {
        const actor = this.getActor()
        const data = {
            fio_address: this.fioAddress,
            bundleSets,
            actor,
            tpid: this.technologyProviderId,
            max_fee: this.maxFee,
        }
        return data
    }
}
