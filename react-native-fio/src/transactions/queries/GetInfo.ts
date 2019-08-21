import { Query } from "./Query";
import  {FioInfoResponse}  from "../../entities/FioInfoResponse";

export class GetInfo extends Query<FioInfoResponse>{
    ENDPOINT:string = "chain/get_info";

    constructor(){
        super();
    }

    getData() {
        return {};
    }
}