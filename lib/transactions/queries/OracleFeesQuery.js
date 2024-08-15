"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleFeesQuery = void 0;
const Query_1 = require("./Query");
class OracleFeesQuery extends Query_1.Query {
    constructor() {
        super(...arguments);
        this.ENDPOINT = 'chain/get_oracle_fees';
    }
    getData() {
        return;
    }
}
exports.OracleFeesQuery = OracleFeesQuery;
