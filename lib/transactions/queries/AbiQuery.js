"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbiQuery = void 0;
const Query_1 = require("./Query");
class AbiQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/get_raw_abi';
        this.getData = () => ({
            account_name: this.props.accountName,
        });
    }
}
exports.AbiQuery = AbiQuery;
