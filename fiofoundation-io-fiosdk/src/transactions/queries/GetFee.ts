import { Query } from "./Query";
import { FioFeeResponse } from "../../entities/FioFeeResponse";
import { Constants } from '../../utils/constants';


export class GetFee extends Query<FioFeeResponse>{
    ENDPOINT:string = "chain/get_fee";
    endPoint:string;
    fioAddress:string

    constructor(endPoint:string,fioAddress:string=""){
        super();
        this.endPoint = endPoint
        this.fioAddress = fioAddress

        if(Constants.feeNoAddressOperation.findIndex(element => element === endPoint) == -1 && fioAddress.length > 0){
            throw new Error("End point "+ endPoint + " should not have any fio address, when requesting fee");
        }
    }

    getData() {
        return {
            end_point:this.endPoint,
            fio_address:this.fioAddress
        };
    }
}