"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountQuery = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class AccountQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getAccount}`;
        this.getData = () => ({ account_name: this.props.actor });
    }
}
exports.AccountQuery = AccountQuery;
