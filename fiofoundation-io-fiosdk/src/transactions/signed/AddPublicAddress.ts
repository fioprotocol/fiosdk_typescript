import { SignedTransaction } from './SignedTransaction';

export class AddPublicAddress extends SignedTransaction{

    ENDPOINT:string = "chain/add_pub_address"; 
    ACTION:string = "addaddress" 
    ACOUNT:string = "fio.system"
    fioAddress:string
    tokenCode:string
    publicAddress:string
    maxFee:number
    walletFioAddress:string

    constructor(fioAddress:string,tokenCode:string,publicAddress:string,maxFee:number,walletFioAddress:string=""){
        super();
        this.fioAddress = fioAddress;
        this.tokenCode = tokenCode;
        this.publicAddress = publicAddress;
        this.maxFee = maxFee
        this.walletFioAddress = walletFioAddress
    }   

    getData():any{
        let actor = this.getActor();
        let data = {
            fio_address:this.fioAddress,
            token_code:this.tokenCode,
            public_address:this.publicAddress,
            actor: actor,
            tpid: this.walletFioAddress,
            max_fee: this.maxFee
        }
        return data;
    }
    
}