"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FioNamesQuery = void 0;
const Query_1 = require("./Query");
class FioNamesQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/get_fio_names';
        this.getData = () => ({ fio_public_key: this.props.fioPublicKey });
    }
}
exports.FioNamesQuery = FioNamesQuery;
