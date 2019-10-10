import { SignedTransaction } from './SignedTransaction';

export class RequestNewFunds extends SignedTransaction{

    ENDPOINT:string = "chain/new_funds_request"; 
    ACTION:string = "newfundsreq" 
    ACOUNT:string = "fio.reqobt"
 
    payerFioAddress:string
    payerFioPublicKey:string
    payeeFioAddress:string
    tokenCode:string
    maxFee:number
    content:any
    walletFioAddress:string
    
    constructor(payerFioAddress:string,payerFioPublicKey:string,payeeFioAddress:string,walletFioAddress:string='',maxFee:number,payeePublicAddress:string,amount:string,tokenCode:string,memo:string|null=null,hash:string|null=null,offlineUrl:string|null=null){
        super();
        this.payerFioAddress = payerFioAddress;
        this.payerFioPublicKey = payerFioPublicKey
        this.payeeFioAddress = payeeFioAddress;
        this.tokenCode = tokenCode;
        this.maxFee = maxFee
        this.content = {
            payee_public_address:payeePublicAddress,
            amount:amount,
            token_code:tokenCode,
            memo:memo,
            hash:hash,
            offline_url:offlineUrl
        }

        if(walletFioAddress){
            this.walletFioAddress = walletFioAddress
        }else{
            this.walletFioAddress = ''
        }
    }

    getData():any{
        let actor = this.getActor();
        const cipherContent = this.getCipherContent('new_funds_content',this.content,this.privateKey,this.payerFioPublicKey)
        let data = {
            payer_fio_address:this.payerFioAddress,
            payee_fio_address:this.payeeFioAddress,
            content:cipherContent,
            max_fee: this.maxFee,
            tpid:this.walletFioAddress,
            actor: actor,
        }
        return data;
    }
    
}