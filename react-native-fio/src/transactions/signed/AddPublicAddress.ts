import { SignedTransaction } from './SignedTransaction';

export class AddPublicAddress extends SignedTransaction{

    ENDPOINT:string = "chain/add_pub_address"; 
    ACTION:string = "addaddress" 
    ACOUNT:string = "fio.system"
    fioAddress:string
    tokenCode:string
    publicAddress:string

    constructor(fioAddress:string,tokenCode:string,publicAddress:string){
        super();
        this.fioAddress = fioAddress;
        this.tokenCode = tokenCode;
        this.publicAddress = publicAddress;
    }

    async getData():Promise<any>{
        let actor = await this.getActor();
        let data = {
            fio_address:this.fioAddress,
            token_code:this.tokenCode,
            public_address:this.publicAddress,
            actor: actor,
            max_fee: 0
        }
        return data;
    }
    
}