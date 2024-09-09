"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbiQuery = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class AbiQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getRawAbi}`;
        this.getData = () => ({
            account_name: this.props.accountName,
        });
    }
}
exports.AbiQuery = AbiQuery;
//# sourceMappingURL=AbiQuery.js.map