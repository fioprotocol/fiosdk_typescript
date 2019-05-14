import { SignedTransaction } from './SignedTransaction'

export class TransferTokens extends SignedTransaction{

    ENDPOINT:string = "chain/transfer_tokens_pub_key"
    ACTION:string = "transferfio" 
    ACOUNT:string = "fio.token"
    payeePublicKey:string
    amount:string
    maxFee:number

    constructor(payeePublicKey:string,amount:string, maxFee:number){
        super()
        this.payeePublicKey = payeePublicKey
        this.amount = amount
        this.maxFee = maxFee
    }

    async getData():Promise<any>{
        let actor = await this.getActor();
        let payee = await TransferTokens.ReactNativeFio.getActor(this.payeePublicKey)

        let data = {
            payee_public_key:payee,
            amount: this.amount,
            max_fee: this.maxFee,
            actor: actor
        }
        return data;
    }
    
}