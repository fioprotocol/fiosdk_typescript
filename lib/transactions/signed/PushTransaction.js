"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushTransaction = void 0;
const constants_1 = require("../../utils/constants");
const SignedTransaction_1 = require("./SignedTransaction");
class PushTransaction extends SignedTransaction_1.SignedTransaction {
    constructor({ action, account, authPermission, data, encryptOptions = {}, }) {
        super();
        this.ENDPOINT = 'chain/push_transaction';
        this.ACTION = '';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.ACTION = action;
        if (account) {
            this.ACCOUNT = account;
        }
        this.data = data;
        this.encryptOptions = encryptOptions;
        this.authPermission = authPermission;
    }
    getData() {
        const data = Object.assign({}, this.data);
        if (data.content && this.encryptOptions && this.encryptOptions.key && this.encryptOptions.contentType) {
            data.content = this.getCipherContent(this.encryptOptions.contentType, data.content, this.privateKey, this.encryptOptions.key);
        }
        return Object.assign(Object.assign({}, data), { actor: this.data.actor != null && this.data.actor !== '' ? this.data.actor : this.getActor(), permission: this.data.permission || 'active' });
    }
}
exports.PushTransaction = PushTransaction;
