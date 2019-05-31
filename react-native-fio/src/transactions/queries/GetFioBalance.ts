import { Query } from "./Query";
import { BalanceResponse } from '../../entities/BalanceResponse'

export class GetFioBalance extends Query<BalanceResponse>{
    ENDPOINT:string = "chain/get_fio_balance";

    constructor(){
        super();
    }
    
    getData() {
        const actor = this.getActor()
        return {fio_public_address:actor}
    }

}