import { Query } from "react-native-fio/transactions/queries/Query";


export class PublicAddressLookUp extends Query{
    ENDPOINT:string = "chain/pub_address_lookup";
    fioAddress:string;
    tokenCode:string;

    constructor(fioAddress:string,tokenCode:string){
        super();
        this.fioAddress = fioAddress;
        this.tokenCode = tokenCode;
    }

    getData() {
        return {
            fio_address:this.fioAddress,
            token_code:this.tokenCode};
    }
}