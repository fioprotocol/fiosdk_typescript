import { Query } from "./Query";


export class SentFioRequests extends Query{
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