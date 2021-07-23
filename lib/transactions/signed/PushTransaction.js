"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushTransaction = void 0;
const SignedTransaction_1 = require("./SignedTransaction");
const constants_1 = require("../../utils/constants");
class PushTransaction extends SignedTransaction_1.SignedTransaction {
    constructor(action, account, data) {
        super();
        this.ENDPOINT = 'chain/push_transaction';
        this.ACTION = '';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.ACTION = action;
        if (account)
            this.ACCOUNT = account;
        this.data = data;
    }
    getData() {
        let actor = this.getActor();
        let data = Object.assign(Object.assign({}, this.data), { actor: actor });
        return data;
    }
}
exports.PushTransaction = PushTransaction;
