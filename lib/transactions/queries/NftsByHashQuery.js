"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsByHashQuery = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class NftsByHashQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getNftsHash}`;
        this.getData = () => ({
            hash: this.props.hash,
            limit: this.props.limit,
            offset: this.props.offset,
        });
    }
}
exports.NftsByHashQuery = NftsByHashQuery;
//# sourceMappingURL=NftsByHashQuery.js.map