"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushTransaction = void 0;
const constants_1 = require("../../utils/constants");
const SignedTransaction_1 = require("./SignedTransaction");
class PushTransaction extends SignedTransaction_1.SignedTransaction {
    constructor(action, account, data) {
        super();
        this.ENDPOINT = 'chain/push_transaction';
        this.ACTION = '';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.ACTION = action;
        if (account) {
            this.ACCOUNT = account;
        }
        this.data = data;
    }
    getData() {
        return Object.assign(Object.assign({}, this.data), { actor: this.data.actor != null && this.data.actor != '' ? this.data.actor : this.getActor() });
    }
}
exports.PushTransaction = PushTransaction;
