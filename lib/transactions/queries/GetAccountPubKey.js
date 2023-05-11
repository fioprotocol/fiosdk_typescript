"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAccountPubKey = void 0;
const Query_1 = require("./Query");
class GetAccountPubKey extends Query_1.Query {
    constructor(account) {
        super();
        this.ENDPOINT = 'chain/get_account_fio_public_key';
        this.account = account;
    }
    getData() {
        return { account: this.account };
    }
}
exports.GetAccountPubKey = GetAccountPubKey;
