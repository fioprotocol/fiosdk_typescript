"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FioAddressesQuery = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class FioAddressesQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getFioAddresses}`;
        this.getData = () => ({
            fio_public_key: this.props.fioPublicKey,
            limit: this.props.limit,
            offset: this.props.offset,
        });
    }
}
exports.FioAddressesQuery = FioAddressesQuery;
