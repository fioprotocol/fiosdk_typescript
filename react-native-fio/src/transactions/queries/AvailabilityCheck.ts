import { Query } from "./Query";


export class AvailabilityCheck extends Query{
    ENDPOINT:string = "chain/avail_check";
    fioName:string;

    constructor(fioName:string){
        super();
        this.fioName = fioName
    }

    getData() {
        return {fio_name:this.fioName};
    }
}