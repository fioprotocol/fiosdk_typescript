"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNames = void 0;
const Query_1 = require("./Query");
class GetNames extends Query_1.Query {
    constructor(fioPublicKey) {
        super();
        this.ENDPOINT = 'chain/get_fio_names';
        this.fioPublicKey = fioPublicKey;
    }
    getData() {
        return { fio_public_key: this.fioPublicKey };
    }
}
exports.GetNames = GetNames;
