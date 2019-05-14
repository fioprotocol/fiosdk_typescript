import { SignedTransaction } from './SignedTransaction';
import { Transactions } from "../Transactions";

export class RegisterFioAddress extends SignedTransaction{

    ENDPOINT:string = "chain/register_fio_address"; 
    ACTION:string = "regaddress" 
    ACOUNT:string = "fio.system"
    fioAddress:string

    constructor(fioAddress:string){
        super();
        this.fioAddress = fioAddress;
    }

    async getData():Promise<any>{
        let actor = await this.getActor();
        let data = {
            fio_address:this.fioAddress,
            owner_fio_public_key:Transactions.publicKey,
            max_fee: 0,
            actor: actor
        }
        return data;
    }
    
}