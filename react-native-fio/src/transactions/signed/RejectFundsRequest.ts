import { SignedTransaction } from './SignedTransaction';

export class RejectFundsRequest extends SignedTransaction{

    ENDPOINT:string = "chain/reject_funds_request"; 
    ACTION:string = "rejectfndreq" 
    ACOUNT:string = "fio.reqobt"
    fioreqid:string


    constructor(fioreqid:string){
        super();
        this.fioreqid = fioreqid;

    }

    async getData():Promise<any>{
        let actor = await this.getActor();
        let data = {
            fio_request_id:this.fioreqid,
            actor: actor,
            max_fee: 0
        }
        return data;
    }
    
}