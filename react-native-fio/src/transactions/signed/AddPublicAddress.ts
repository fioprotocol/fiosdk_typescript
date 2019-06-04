import { SignedTransaction } from './SignedTransaction';

export class AddPublicAddress extends SignedTransaction{

    ENDPOINT:string = "chain/add_pub_address"; 
    ACTION:string = "addaddress" 
    ACOUNT:string = "fio.system"
    fioAddress:string
    tokenCode:string
    publicAddress:string
    maxFee:number

    constructor(fioAddress:string,tokenCode:string,publicAddress:string,maxFee:number){
        super();
        this.fioAddress = fioAddress;
        this.tokenCode = tokenCode;
        this.publicAddress = publicAddress;
        this.maxFee = maxFee
    }   

    getData():any{
        let actor = this.getActor();
        let data = {
            fio_address:this.fioAddress,
            token_code:this.tokenCode,
            public_address:this.publicAddress,
            actor: actor,
            max_fee: this.maxFee
        }
        return data;
    }
    
}