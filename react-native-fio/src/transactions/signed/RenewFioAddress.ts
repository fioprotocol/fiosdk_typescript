import { SignedTransaction } from './SignedTransaction';
export class RenewFioAddress extends SignedTransaction{

    ENDPOINT:string = "chain/renew_fio_address"; 
    ACTION:string = "renewaddress" 
    ACOUNT:string = "fio.system"
    fioAddress:string
    maxFee:number
    tpid:String

    constructor(fioAddress:string,maxFee:number,tpid:string=""){
        super();
        this.fioAddress = fioAddress;
        this.maxFee = maxFee;
        this.tpid = tpid;
    }

    getData():any{
        let actor = this.getActor();
        let data = {
            fio_address:this.fioAddress,
            max_fee: this.maxFee,
            tpid: this.tpid,
            actor: actor
        }
        return data;
    }
    
}