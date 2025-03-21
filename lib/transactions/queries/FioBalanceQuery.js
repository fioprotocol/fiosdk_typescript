"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FioBalanceQuery = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class FioBalanceQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getFioBalance}`;
        this.getData = () => { var _a; return ({ fio_public_key: (_a = this.props.fioPublicKey) !== null && _a !== void 0 ? _a : this.publicKey }); };
    }
}
exports.FioBalanceQuery = FioBalanceQuery;
//# sourceMappingURL=FioBalanceQuery.js.map