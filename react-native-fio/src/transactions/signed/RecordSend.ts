import { RecordSendRequest } from '../../entities/RecordSendRequest';

import { SignedTransaction } from './SignedTransaction';

export class RecordSend extends SignedTransaction{

    ENDPOINT:string = "chain/record_send"; 
    ACTION:string = "recordsend";
    ACOUNT:string = "fio.reqobt";
    recordSendRequest:RecordSendRequest

    constructor(recordSendRequest:RecordSendRequest){
        super();
        this.recordSendRequest = recordSendRequest
        recordSendRequest.max_fee = 0;
    }

    getData():any{
        let actor =  this.getActor();
        this.recordSendRequest.actor = actor;
        let data = this.recordSendRequest;
        /*{
            recordsend:JSON.stringify(this.recordSendRequest)
        }*/
        return data;
    }
    
}