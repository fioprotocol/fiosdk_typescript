"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
class PublicAddressLookUp extends Query_1.Query {
    constructor(fioAddress, tokenCode) {
        super();
        this.ENDPOINT = "chain/pub_address_lookup";
        this.fioAddress = fioAddress;
        this.tokenCode = tokenCode;
    }
    getData() {
        return {
            fio_address: this.fioAddress,
            token_code: this.tokenCode
        };
    }
}
exports.PublicAddressLookUp = PublicAddressLookUp;
