import { Query } from "./Query";
import { PendingFioRequestsResponse } from "../../entities/PendingFioRequestsResponse";

export class PendingFioRequests extends Query<PendingFioRequestsResponse>{
    ENDPOINT:string = "chain/get_pending_fio_requests";
    publicAddress:string;

    constructor(publicAddress:string){
        super();
        this.publicAddress = publicAddress
    }

    getData() {
        return {fio_public_address:this.publicAddress};
    }
}