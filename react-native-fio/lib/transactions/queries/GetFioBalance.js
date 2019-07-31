"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
class GetFioBalance extends Query_1.Query {
    constructor(othersBalance) {
        super();
        this.ENDPOINT = "chain/get_fio_balance";
        if (othersBalance) {
            this.keyToUse = othersBalance;
        }
        else {
            this.keyToUse = this.publicKey;
        }
        super();
    }
    getData() {
        return { fio_public_address: this.publicKey };
    }
}
exports.GetFioBalance = GetFioBalance;
