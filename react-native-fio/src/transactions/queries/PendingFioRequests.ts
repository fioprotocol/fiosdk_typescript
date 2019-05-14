import { Query } from "./Query";
import { PendingFioRequestsResponse } from "../../entities/PendingFioRequestsResponse";

export class PendingFioRequests extends Query<PendingFioRequestsResponse>{
    ENDPOINT:string = "chain/get_pending_fio_requests";
    fioPublicKey:string;

    constructor(fioPublicKey:string){
        super();
        this.fioPublicKey = fioPublicKey
    }

    getData() {
        return {fio_public_key:this.fioPublicKey};
    }
}