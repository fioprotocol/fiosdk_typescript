import { SignedTransaction } from './SignedTransaction';

export class RequestNewFunds extends SignedTransaction{

    ENDPOINT:string = "chain/new_funds_request"; 
    ACTION:string = "newfundsreq" 
    ACOUNT:string = "fio.reqobt"
 
    payerFioAddress:string
    payeeFioAddress:string
    payeePublicAddress:string
    tokenCode:string
    amount: Number; 
    metaData:string
    maxFee:number

    constructor(payerFioAddress:string,payeeFioAddress:string,payeePublicAddress:string,tokenCode:string,amount:Number,metaData:string, maxFee:number){
        super();
        this.payerFioAddress = payerFioAddress;
        this.payeeFioAddress = payeeFioAddress;
        this.payeePublicAddress = payeePublicAddress
        this.tokenCode = tokenCode;
        this.amount = amount;
        this.metaData = metaData;
        this.maxFee = maxFee
    }

    getData():any{
        let actor = this.getActor();
        let data = {
            payer_fio_address:this.payerFioAddress,
            payee_fio_address:this.payeeFioAddress,
            payee_public_address:this.payeePublicAddress,
            amount:this.amount,
            token_code:this.tokenCode,
            metadata:this.metaData,
            actor: actor,
            max_fee: this.maxFee
        }
        return data;
    }
    
}