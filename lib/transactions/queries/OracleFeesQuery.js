"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleFeesQuery = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class OracleFeesQuery extends Query_1.Query {
    constructor() {
        super(...arguments);
        this.ENDPOINT = `chain/${entities_1.EndPoint.getOracleFees}`;
    }
    getData() {
        return;
    }
}
exports.OracleFeesQuery = OracleFeesQuery;
