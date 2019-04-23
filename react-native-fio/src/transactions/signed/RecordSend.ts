import { SignedTransaction } from 'react-native-fio/transactions/signed/SignedTransaction';
import { RecordSendRequest } from '../../entities/RecordSendRequest';

export class RecordSend extends SignedTransaction{

    ENDPOINT:string = "chain/record_send"; 
    ACTION:string = "recordsend";
    ACOUNT:string = "fio.reqobt";
    recordSendRequest:RecordSendRequest

    constructor(recordSendRequest:RecordSendRequest){
        super();
        this.recordSendRequest = recordSendRequest
    }

    async getData():Promise<any>{
        let actor = await this.getActor();
        this.recordSendRequest.actor = actor;
        let data = {
            recordsend:JSON.stringify(this.recordSendRequest)
        }
        return data;
    }
    
}