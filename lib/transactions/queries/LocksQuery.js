"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocksQuery = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class LocksQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getLocks}`;
        this.getData = () => ({ fio_public_key: this.props.fioPublicKey });
    }
}
exports.LocksQuery = LocksQuery;
