import { SignedTransaction } from './SignedTransaction';
import { Transactions } from "../Transactions";

export class RegisterFioDomain extends SignedTransaction{

    ENDPOINT:string = "chain/register_fio_domain"; 
    ACTION:string = "regdomain" 
    ACOUNT:string = "fio.system"
    fioDomain:string

    constructor(fioDomain:string){
        super();
        this.fioDomain = fioDomain;
    }

    async getData():Promise<any>{
        let actor = await this.getActor();
        let data = {
            fio_domain:this.fioDomain,
            owner_fio_public_key:Transactions.publicKey,
            max_fee: 0,
            actor: actor
        }
        return data;
    }
    
}