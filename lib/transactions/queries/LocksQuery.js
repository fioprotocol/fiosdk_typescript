"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocksQuery = void 0;
const Query_1 = require("./Query");
class LocksQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/get_locks';
        this.getData = () => ({ fio_public_key: this.props.fioPublicKey });
    }
}
exports.LocksQuery = LocksQuery;
