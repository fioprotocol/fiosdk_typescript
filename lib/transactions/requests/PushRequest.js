"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushRequest = void 0;
const entities_1 = require("../../entities");
const SignedRequest_1 = require("./SignedRequest");
class PushRequest extends SignedRequest_1.SignedRequest {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.pushTransaction}`;
        this.ACCOUNT = entities_1.Account.address;
        this.ACTION = props.action;
        if (props.account) {
            this.ACCOUNT = props.account;
        }
    }
    getData() {
        const data = Object.assign({}, this.props.data);
        const { encryptOptions } = this.props;
        if (data.content
            && encryptOptions
            && encryptOptions.publicKey
            && encryptOptions.contentType) {
            data.content = this.getCipherContent(encryptOptions.contentType, data.content, encryptOptions.privateKey || this.privateKey, encryptOptions.publicKey);
        }
        return Object.assign(Object.assign({}, data), { actor: this.props.data.actor != null
                && this.props.data.actor !== ''
                ? this.props.data.actor
                : this.getActor() });
    }
}
exports.PushRequest = PushRequest;
//# sourceMappingURL=PushRequest.js.map