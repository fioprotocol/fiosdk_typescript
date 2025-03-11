"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAccount = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class GetAccount extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getAccount}`;
        this.getData = () => ({ account_name: this.props.actor });
    }
}
exports.GetAccount = GetAccount;
//# sourceMappingURL=GetAccount.js.map