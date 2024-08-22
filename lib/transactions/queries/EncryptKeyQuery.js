"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptKeyQuery = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class EncryptKeyQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getEncryptKey}`;
        this.getData = () => ({ fio_address: this.props.fioAddress });
    }
}
exports.EncryptKeyQuery = EncryptKeyQuery;
