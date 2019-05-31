"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
class GetFioBalance extends Query_1.Query {
    constructor() {
        super();
        this.ENDPOINT = "chain/get_fio_balance";
    }
    getData() {
        const actor = this.getActor();
        return { fio_public_address: actor };
    }
}
exports.GetFioBalance = GetFioBalance;
