"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPublicAddress = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class GetPublicAddress extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getPublicAddress}`;
        this.getData = () => ({
            chain_code: this.props.chainCode,
            fio_address: this.props.fioAddress,
            token_code: this.props.tokenCode,
        });
    }
}
exports.GetPublicAddress = GetPublicAddress;
//# sourceMappingURL=GetPublicAddress.js.map