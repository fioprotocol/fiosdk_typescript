"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNames = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class GetNames extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getFioNames}`;
        this.getData = () => ({ fio_public_key: this.props.fioPublicKey });
    }
}
exports.GetNames = GetNames;
//# sourceMappingURL=GetNames.js.map