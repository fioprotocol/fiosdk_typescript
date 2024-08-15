"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptKeyQuery = void 0;
const Query_1 = require("./Query");
class EncryptKeyQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/get_encrypt_key';
        this.getData = () => ({ fio_address: this.props.fioAddress });
    }
}
exports.EncryptKeyQuery = EncryptKeyQuery;
