import { Query } from "react-native-fio/transactions/queries/Query";


export class GetNames extends Query{
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