"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FioDomainsQuery = void 0;
const Query_1 = require("./Query");
class FioDomainsQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/get_fio_domains';
        this.getData = () => ({
            fio_public_key: this.props.fioPublicKey,
            limit: this.props.limit,
            offset: this.props.offset,
        });
    }
}
exports.FioDomainsQuery = FioDomainsQuery;
