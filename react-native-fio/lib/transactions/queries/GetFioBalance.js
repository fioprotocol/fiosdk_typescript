"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
class GetFioBalance extends Query_1.Query {
    constructor(fioAddress) {
        super();
        this.ENDPOINT = "chain/get_fio_balance";
        this.fioAddress = fioAddress;
    }
    getData() {
        return { fio_public_address: this.fioAddress };
    }
}
exports.GetFioBalance = GetFioBalance;
