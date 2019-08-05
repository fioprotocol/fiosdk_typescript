import { SignedTransaction } from './SignedTransaction';
export class RegisterFioAddress extends SignedTransaction{

    ENDPOINT:string = "chain/register_fio_address"; 
    ACTION:string = "regaddress" 
    ACOUNT:string = "fio.system"
    fioAddress:string
    maxFee:number

    constructor(fioAddress:string,maxFee:number){
        super();
        this.fioAddress = fioAddress;
        this.maxFee = maxFee
    }

    getData():any{
        let actor = this.getActor();
        let data = {
            fio_address:this.fioAddress,
            owner_fio_public_key:this.publicKey,
            max_fee: this.maxFee,
            actor: actor
        }
        return data;
    }
    
}