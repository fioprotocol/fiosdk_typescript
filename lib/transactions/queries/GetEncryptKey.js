"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEncryptKey = void 0;
const Query_1 = require("./Query");
class GetEncryptKey extends Query_1.Query {
    constructor(fioAddress) {
        super();
        this.ENDPOINT = 'chain/get_encrypt_key';
        this.fioAddress = fioAddress;
    }
    getData() {
        return { fio_address: this.fioAddress };
    }
}
exports.GetEncryptKey = GetEncryptKey;
