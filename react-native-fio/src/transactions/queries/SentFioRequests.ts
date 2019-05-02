import { Query } from "./Query";
import { SentFioRequestResponse } from "../../entities/SentFioRequestsResponse";


export class SentFioRequests extends Query<SentFioRequestResponse>{
    ENDPOINT:string = "chain/get_sent_fio_requests";
    fioAddress:string;

    constructor(fioAddress:string){
        super();
        this.fioAddress = fioAddress;
    }

    getData() {
        return {
            fio_public_address:this.fioAddress,
        };
    }
}