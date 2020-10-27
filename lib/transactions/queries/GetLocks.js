"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLocks = void 0;
const Query_1 = require("./Query");
class GetLocks extends Query_1.Query {
    constructor(fioPublicKey) {
        super();
        this.ENDPOINT = 'chain/get_locks';
        this.keyToUse = fioPublicKey;
    }
    getData() {
        return { fio_public_key: this.keyToUse };
    }
}
exports.GetLocks = GetLocks;
