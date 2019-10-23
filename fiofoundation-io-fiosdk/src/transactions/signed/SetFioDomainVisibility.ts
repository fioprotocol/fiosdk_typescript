import { SignedTransaction } from './SignedTransaction'

export class SetFioDomainVisibility extends SignedTransaction {

    public ENDPOINT: string = 'chain/set_fio_domain_public'
    public ACTION: string = 'addaddress'
    public ACOUNT: string = 'fio.system'
    public fioAddress: string
    public isPublic: number
    public maxFee: number
    public walletFioAddress: string

    constructor(fioAddress: string, isPublic: boolean, maxFee: number, walletFioAddress: string= '') {
        super()
        this.fioAddress = fioAddress
        this.isPublic = isPublic ? 1 : 0
        this.maxFee = maxFee
        this.walletFioAddress = walletFioAddress
    }

    public getData(): any {
        const actor = this.getActor()
        const data = {
            fio_address: this.fioAddress,
            is_public: this.isPublic,
            max_fee: this.maxFee,
            tpid: this.walletFioAddress,
            actor,
        }
        return data
    }

}
