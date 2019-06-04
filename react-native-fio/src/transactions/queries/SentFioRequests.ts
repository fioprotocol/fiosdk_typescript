import { Query } from "./Query";
import { SentFioRequestResponse } from "../../entities/SentFioRequestsResponse";


export class SentFioRequests extends Query<SentFioRequestResponse>{
    ENDPOINT:string = "chain/get_sent_fio_requests";
    fioPublicKey:string;

    constructor(fioPublicKey:string){
        super();
        this.fioPublicKey = fioPublicKey;
    }

    getData() {
        return {
            fio_public_key:this.fioPublicKey,
        };
    }
}