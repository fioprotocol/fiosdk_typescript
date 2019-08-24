import { SignedTransaction } from './SignedTransaction';
export class RegisterFioAddress extends SignedTransaction{

    ENDPOINT:string = "chain/register_fio_address"; 
    ACTION:string = "regaddress" 
    ACOUNT:string = "fio.system"
    fioAddress:string
    maxFee:number
    tpid:string

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
            owner_fio_public_key:this.publicKey,
            max_fee: this.maxFee,
            tpid: this.tpid,
            actor: actor
        }
        return data;
    }
    
}