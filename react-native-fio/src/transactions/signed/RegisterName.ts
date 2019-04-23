import { SignedTransaction } from 'react-native-fio/transactions/signed/SignedTransaction';

export class RegisterName extends SignedTransaction{

    ENDPOINT:string = "chain/register_fio_name"; 
    ACTION:string = "registername" 
    ACOUNT:string = "fio.system"
    fioName:string

    constructor(fioNmae:string){
        super();
        this.fioName = fioNmae;
    }

    async getData():Promise<any>{
        let actor = await this.getActor();
        let data = {
            fio_name:this.fioName,
            actor: actor
        }
        return data;
    }
    
}