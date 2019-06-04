import { SignedTransaction } from './SignedTransaction';
export class RegisterFioAddress extends SignedTransaction{

    ENDPOINT:string = "chain/register_fio_address"; 
    ACTION:string = "regaddress" 
    ACOUNT:string = "fio.system"
    fioAddress:string

    constructor(fioAddress:string){
        super();
        this.fioAddress = fioAddress;
    }

    getData():any{
        let actor = this.getActor();
        let data = {
            fio_address:this.fioAddress,
            owner_fio_public_key:this.publicKey,
            max_fee: 0,
            actor: actor
        }
        return data;
    }
    
}