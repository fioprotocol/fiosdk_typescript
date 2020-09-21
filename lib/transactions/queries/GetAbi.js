"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAbi = void 0;
const Query_1 = require("./Query");
class GetAbi extends Query_1.Query {
    constructor(accountName) {
        super();
        this.ENDPOINT = 'chain/get_raw_abi';
        this.accountName = accountName;
    }
    getData() {
        return {
            account_name: this.accountName
        };
    }
}
exports.GetAbi = GetAbi;
