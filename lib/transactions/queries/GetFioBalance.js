"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFioBalance = void 0;
const Query_1 = require("./Query");
class GetFioBalance extends Query_1.Query {
    constructor(othersBalance) {
        super();
        this.ENDPOINT = 'chain/get_fio_balance';
        this.keyToUse = othersBalance || '';
    }
    getData() {
        return { fio_public_key: this.keyToUse || this.publicKey };
    }
}
exports.GetFioBalance = GetFioBalance;
