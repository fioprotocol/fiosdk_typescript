import { Query } from "./Query";
import { AvailabilityResponse } from '../../entities/AvailabilityResponse'

export class AvailabilityCheck extends Query<AvailabilityResponse>{
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