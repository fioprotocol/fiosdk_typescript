import { Query } from "./Query";
import { FioNamesResponse } from "../../entities/FioNamesResponse";


export class GetNames extends Query<FioNamesResponse>{
    ENDPOINT:string = "chain/get_fio_names";
    fioPublicKey:string;

    constructor(fioPublicKey:string){
        super();
        this.fioPublicKey = fioPublicKey
    }

    getData() {
        return {fio_public_key:this.fioPublicKey};
    }
}