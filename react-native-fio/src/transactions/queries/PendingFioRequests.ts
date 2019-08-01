import { Query } from "./Query";
import { PendingFioRequestsResponse } from "../../entities/PendingFioRequestsResponse";
import { PendingFioRequest } from "../../entities/PendingFioRequest";

export class PendingFioRequests extends Query<PendingFioRequestsResponse>{
    ENDPOINT:string = "chain/get_pending_fio_requests";
    fioPublicKey:string;
    isEncrypted=true

    constructor(fioPublicKey:string){
        super();
        this.fioPublicKey = fioPublicKey
    }

    getData() {
        return {fio_public_key:this.fioPublicKey};
    }
    decrypt(result:any):any{
        console.error('decrypt: ', result)
        if(result.requests.length > 0){
            const pendings: PendingFioRequest[] = []
            result.requests.forEach( (value:PendingFioRequest ) => {
                const content = this.getUnCipherContent('new_funds_content',value.content,this.privateKey,value.payer_fio_public_key)
                console.error("PendingFioRequests:content: ",content)
                pendings.push(content)                
            })
            return pendings
        }
    }
}