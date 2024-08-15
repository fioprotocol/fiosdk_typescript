"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountQuery = void 0;
const Query_1 = require("./Query");
class AccountQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/get_account';
        this.getData = () => ({ account_name: this.props.actor });
    }
}
exports.AccountQuery = AccountQuery;
