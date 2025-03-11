"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAbi = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class GetAbi extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getRawAbi}`;
        this.getData = () => ({
            account_name: this.props.accountName,
        });
    }
}
exports.GetAbi = GetAbi;
//# sourceMappingURL=GetAbi.js.map