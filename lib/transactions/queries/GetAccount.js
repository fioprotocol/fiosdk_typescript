"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAccount = void 0;
const Query_1 = require("./Query");
class GetAccount extends Query_1.Query {
    constructor(actor) {
        super();
        this.ENDPOINT = 'chain/get_account';
        this.accountToUse = actor;
    }
    getData() {
        return { account_name: this.accountToUse };
    }
}
exports.GetAccount = GetAccount;
