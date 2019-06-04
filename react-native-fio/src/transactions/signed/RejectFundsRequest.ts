import { SignedTransaction } from './SignedTransaction';

export class RejectFundsRequest extends SignedTransaction{

    ENDPOINT:string = "chain/reject_funds_request"; 
    ACTION:string = "rejectfndreq" 
    ACOUNT:string = "fio.reqobt"
    fioreqid:string
    maxFee:number

    constructor(fioreqid:string,maxFee:number){
        super();
        this.fioreqid = fioreqid;
        this.maxFee = maxFee

    }

    getData():any{
        let actor = this.getActor();
        let data = {
            fio_request_id:this.fioreqid,
            actor: actor,
            max_fee: this.maxFee
        }
        return data;
    }
    
}