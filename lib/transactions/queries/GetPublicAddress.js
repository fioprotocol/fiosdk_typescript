"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPublicAddress = void 0;
const Query_1 = require("./Query");
class GetPublicAddress extends Query_1.Query {
    constructor(fioAddress, chainCode, tokenCode) {
        super();
        this.ENDPOINT = 'chain/get_pub_address';
        this.fioAddress = fioAddress;
        this.chainCode = chainCode;
        this.tokenCode = tokenCode;
    }
    getData() {
        return {
            fio_address: this.fioAddress,
            chain_code: this.chainCode,
            token_code: this.tokenCode
        };
    }
}
exports.GetPublicAddress = GetPublicAddress;
