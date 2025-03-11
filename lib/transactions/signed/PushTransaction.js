"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushTransaction = void 0;
const entities_1 = require("../../entities");
const SignedTransaction_1 = require("./SignedTransaction");
class PushTransaction extends SignedTransaction_1.SignedTransaction {
    constructor(config, props) {
        super(config);
        this.ENDPOINT = `chain/${entities_1.EndPoint.pushTransaction}`;
        this.ACCOUNT = entities_1.Account.address;
        this.ACTION = props.action;
        if (props.account) {
            this.ACCOUNT = props.account;
        }
        this.data = props.data;
        this.encryptOptions = props.encryptOptions;
        this.authPermission = props.authPermission;
        this.signingAccount = props.signingAccount;
    }
    getData() {
        const data = Object.assign({}, this.data);
        if (data.content
            && this.encryptOptions
            && this.encryptOptions.publicKey
            && this.encryptOptions.contentType) {
            data.content = this.getCipherContent(this.encryptOptions.contentType, data.content, this.encryptOptions.privateKey || this.privateKey, this.encryptOptions.publicKey);
        }
        if (data.actor === null || data.actor === '') {
            data.content = this.getActor();
        }
        return data;
    }
}
exports.PushTransaction = PushTransaction;
//# sourceMappingURL=PushTransaction.js.map