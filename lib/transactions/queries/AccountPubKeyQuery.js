"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountPubKeyQuery = void 0;
const Query_1 = require("./Query");
class AccountPubKeyQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/get_account_fio_public_key';
        this.getData = () => ({ account: this.props.account });
    }
}
exports.AccountPubKeyQuery = AccountPubKeyQuery;
