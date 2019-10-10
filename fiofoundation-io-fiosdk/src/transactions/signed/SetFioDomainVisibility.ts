import { SignedTransaction } from './SignedTransaction';

export class SetFioDomainVisibility extends SignedTransaction{

    ENDPOINT:string = "chain/set_fio_domain_public";
    ACTION:string = "addaddress" 
    ACOUNT:string = "fio.system"
    fioAddress:string
    isPublic:number
    maxFee:number
    walletFioAddress:string

    constructor(fioAddress:string, isPublic:number, maxFee:number, walletFioAddress:string="") {
        super();
        this.fioAddress = fioAddress;
        this.isPublic = isPublic;
        this.maxFee = maxFee
        this.walletFioAddress = walletFioAddress
    }   

    getData():any {
        let actor = this.getActor();
        let data = {
            fio_address: this.fioAddress,
            is_public: this.isPublic,
            max_fee: this.maxFee,
            tpid: this.walletFioAddress,
            actor: actor
        }
        return data;
    }
    
}