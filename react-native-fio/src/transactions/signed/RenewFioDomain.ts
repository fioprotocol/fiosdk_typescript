import { SignedTransaction } from './SignedTransaction';
export class RenewFioDomain extends SignedTransaction{

    ENDPOINT:string = "chain/renew_fio_domain"; 
    ACTION:string = "renewdomain" 
    ACOUNT:string = "fio.system"
    fioDomain:string
    maxFee:number
    tpid:string

    constructor(fioDomain:string, maxFee:number,tpid:string=""){
        super();
        this.fioDomain = fioDomain;
        this.maxFee = maxFee;
        this.tpid = tpid;
    }

    getData():any{
        let actor = this.getActor();
        let data = {
            fio_domain:this.fioDomain,
            max_fee: this.maxFee,
            tpid:this.tpid,
            actor: actor
        }
        return data;
    }
    
}