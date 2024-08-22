"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FioDomainsQuery = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class FioDomainsQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getFioDomains}`;
        this.getData = () => ({
            fio_public_key: this.props.fioPublicKey,
            limit: this.props.limit,
            offset: this.props.offset,
        });
    }
}
exports.FioDomainsQuery = FioDomainsQuery;
