"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNftsByHash = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class GetNftsByHash extends Query_1.Query {
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
exports.GetNftsByHash = GetNftsByHash;
//# sourceMappingURL=GetNftsByHash.js.map