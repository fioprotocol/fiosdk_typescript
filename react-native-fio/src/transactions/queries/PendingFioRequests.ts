import { Query } from "./Query";


export class PendingFioRequests extends Query{
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