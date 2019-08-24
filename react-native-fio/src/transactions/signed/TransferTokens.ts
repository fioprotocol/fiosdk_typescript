import { SignedTransaction } from './SignedTransaction'

export class TransferTokens extends SignedTransaction{

    ENDPOINT:string = "chain/transfer_tokens_pub_key"
    ACTION:string = "trnsfiopubky" 
    ACOUNT:string = "fio.token"
    payeePublicKey:string
    amount:number
    maxFee:number
    tpid:string
    constructor(payeePublicKey:string,amount:number, maxFee:number,tpid=''){
        super()
        this.payeePublicKey = payeePublicKey
        this.amount = amount
        this.tpid = tpid
        this.maxFee = maxFee
    }

    getData():any{
        let actor = this.getActor();
         
        let data = {
            payee_public_key:this.payeePublicKey,
            amount: this.amount,
            max_fee: this.maxFee,
            tpid:this.tpid,
            actor: actor
        }
        return data;
    }
    
}