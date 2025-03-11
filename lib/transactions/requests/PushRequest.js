"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushRequest = void 0;
const entities_1 = require("../../entities");
const SignedRequest_1 = require("./SignedRequest");
class PushRequest extends SignedRequest_1.SignedRequest {
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
exports.PushRequest = PushRequest;
//# sourceMappingURL=PushRequest.js.map