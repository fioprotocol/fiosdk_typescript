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
    metadata: string
    maxFee: number
    status: string
    tpid: string
    constructor(fioReqID: string = '',
        payerFIOAddress: string,
        payeeFIOAddress: string,
        payerPublicAddress: string,
        payeePublicAddress: string,
        amount: number,
        tokenCode: string,
        obtID: string,
        metadata: string,
        maxFee: number,
        tpid: string,
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
        this.metadata = metadata
        this.maxFee = maxFee
        if(status){
            this.status = status
        }else{
            this.status = 'sent_to_blockchain'
        }
        
        this.tpid = tpid
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
            metadata: this.metadata,
            max_fee: this.maxFee,
            actor: actor,
            status: this.status,
            tpid: this.tpid
        }
        return data;
    }
    
}