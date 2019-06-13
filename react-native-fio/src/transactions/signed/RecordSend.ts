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
    status: string

    constructor(fioReqID: string = '',
        payerFIOAddress: string,
        payeeFIOAddress: string,
        payerPublicAddress: string,
        payeePublicAddress: string,
        amount: number,
        tokenCode: string,
        obtID: string,
        memo: string,
        maxFee: number,
        status:string = 'sent_to_blockchain'){
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
        this.status = status
    }

    getData():any{
        let actor =  this.getActor();
        let data = {
            fio_request_id: this.fioReqID,
            payer_fio_address: this.payerFIOAddress,
            payee_fio_address: this.payeeFIOAddress,
            payer_public_address: this.payerPublicAddress,
            payee_public_address: this.payeePublicAddress,
            amount: this.amount,
            token_code: this.tokenCode,
            obt_id: this.obtID,
            memo: this.memo,
            maxFee: this.maxFee,
            actor: actor,
            status: this.status
        }
        return data;
    }
    
}