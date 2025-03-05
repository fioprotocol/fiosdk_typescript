"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEncryptKey = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class GetEncryptKey extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getEncryptKey}`;
        this.getData = () => ({ fio_address: this.props.fioAddress });
    }
}
exports.GetEncryptKey = GetEncryptKey;
//# sourceMappingURL=GetEncryptKey.js.map