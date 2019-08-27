import { Query } from "./Query";
import { PendingFioRequestsResponse } from "../../entities/PendingFioRequestsResponse";
import { FioRequest } from "../../entities/FioRequest";

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
        if(result.requests.length > 0){
            const pendings: FioRequest[] = []
            result.requests.forEach( (value:FioRequest ) => {
                let content
                if(value.payer_fio_public_key === this.publicKey){
                    content = this.getUnCipherContent('new_funds_content',value.content,this.privateKey,value.payee_fio_public_key)
                }else{
                    content = this.getUnCipherContent('new_funds_content',value.content,this.privateKey,value.payer_fio_public_key)
                }
                value.content = content                
                pendings.push(value)                
            })
            return pendings
        }
    }
}