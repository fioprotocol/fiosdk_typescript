"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountPubKeyQuery = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class AccountPubKeyQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getAccountFioPublicKey}`;
        this.getData = () => ({ account: this.props.account });
    }
}
exports.AccountPubKeyQuery = AccountPubKeyQuery;
//# sourceMappingURL=AccountPubKeyQuery.js.map