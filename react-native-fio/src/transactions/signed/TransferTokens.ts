import { SignedTransaction } from './SignedTransaction'

export class TransferTokens extends SignedTransaction{

    ENDPOINT:string = "chain/transfer_tokens"
    ACTION:string = "transferfio" 
    ACOUNT:string = "fio.token"
    payeePublicKey:string
    amount:string
    constructor(payeePublicKey:string,amount:string){
        super()
        this.payeePublicKey = payeePublicKey
        this.amount = amount
    }

    async getData():Promise<any>{
        let actor = await this.getActor();
        let data = {
            payee_public_key:this.payeePublicKey,
            amount: this.amount,
            max_fee: 0,
            actor: actor
        }
        return data;
    }
    
}