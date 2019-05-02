import { Query } from "./Query";
import { FioNamesResponse } from "../../entities/FioNamesResponse";


export class GetNames extends Query<FioNamesResponse>{
    ENDPOINT:string = "chain/get_fio_names";
    fioAddress:string;

    constructor(fioAddress:string){
        super();
        this.fioAddress = fioAddress
    }

    getData() {
        return {fio_public_address:this.fioAddress};
    }
}