"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
class GetPublicAddress extends Query_1.Query {
    constructor(fioAddress, tokenCode) {
        super();
        this.ENDPOINT = 'chain/get_pub_address';
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
exports.GetPublicAddress = GetPublicAddress;
