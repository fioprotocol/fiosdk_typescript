import { Query } from "./Query";
import { BalanceResponse } from '../../entities/BalanceResponse'

export class GetFioBalance extends Query<BalanceResponse>{
    ENDPOINT:string = "chain/get_fio_balance";
    fioAddress:string;

    constructor(fioAddress:string){
        super();
        this.fioAddress = fioAddress
    }

    getData() {
        return {fio_public_address:this.fioAddress};
    }

}