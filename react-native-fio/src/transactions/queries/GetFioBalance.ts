import { Query } from "./Query";


export class GetFioBalance extends Query{
    ENDPOINT:string = "chain/get_fio_balance";
    fioAddress:string;

    constructor(fioAddress:string){
        super();
        this.fioAddress = fioAddress
    }

    getData() {
        return {fio_pub_address:this.fioAddress};
    }


}