"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOracleFees = void 0;
const Query_1 = require("./Query");
class GetOracleFees extends Query_1.Query {
    constructor() {
        super();
        this.ENDPOINT = 'chain/get_oracle_fees';
    }
    getData() {
        return;
    }
}
exports.GetOracleFees = GetOracleFees;
