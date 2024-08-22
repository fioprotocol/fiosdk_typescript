"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAddressQuery = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class PublicAddressQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getPubAddress}`;
        this.getData = () => ({
            chain_code: this.props.chainCode,
            fio_address: this.props.fioAddress,
            token_code: this.props.tokenCode,
        });
    }
}
exports.PublicAddressQuery = PublicAddressQuery;
