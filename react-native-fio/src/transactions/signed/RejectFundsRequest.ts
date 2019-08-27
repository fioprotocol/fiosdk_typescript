import { SignedTransaction } from './SignedTransaction';

export class RejectFundsRequest extends SignedTransaction{

    ENDPOINT:string = "chain/reject_funds_request"; 
    ACTION:string = "rejectfndreq" 
    ACOUNT:string = "fio.reqobt"
    fioreqid:string
    maxFee:number
    walletFioAddress:string

    constructor(fioreqid:string,maxFee:number,walletFioAddress:string=""){
        super();
        this.fioreqid = fioreqid;
        this.maxFee = maxFee;
        this.walletFioAddress = walletFioAddress;
    }

    getData():any{
        let actor = this.getActor();
        let data = {
            fio_request_id:this.fioreqid,
            max_fee: this.maxFee,
            tpid: this.walletFioAddress,
            actor: actor
        }
        return data;
    }
    
}