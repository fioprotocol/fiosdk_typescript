import { SignedTransaction } from './SignedTransaction';

export class RecordSend extends SignedTransaction{

    ENDPOINT:string = "chain/record_send"; 
    ACTION:string = "recordsend";
    ACOUNT:string = "fio.reqobt";
    fioReqID: string = ''
    payerFIOAddress: string
    payeeFIOAddress: string
    payerPublicAddress: string
    payeePublicAddress: string
    amount: number
    tokenCode: string
    obtID: string
    memo: string
    maxFee: number

    constructor(fioReqID: string = '',
        payerFIOAddress: string,
        payeeFIOAddress: string,
        payerPublicAddress: string,
        payeePublicAddress: string,
        amount: number,
        tokenCode: string,
        obtID: string,
        memo: string,
        maxFee: number){
        super();
        this.fioReqID = fioReqID
        this.payerFIOAddress = payerFIOAddress
        this.payeeFIOAddress = payeeFIOAddress
        this.payerPublicAddress = payerPublicAddress
        this.payeePublicAddress = payeePublicAddress
        this.amount = amount
        this.tokenCode = tokenCode
        this.obtID = obtID
        this.memo = memo
        this.maxFee = maxFee
    }

    getData():any{
        let actor =  this.getActor();
        let data = {
            fioReqID: this.fioReqID,
            payerFIOAddress: this.payerFIOAddress,
            payeeFIOAddress: this.payeeFIOAddress,
            payerPublicAddress: this.payerPublicAddress,
            payeePublicAddress: this.payeePublicAddress,
            amount: this.amount,
            tokenCode: this.tokenCode,
            obtID: this.obtID,
            memo: this.memo,
            maxFee: this.maxFee,
            actor: actor
        }
        return data;
    }
    
}