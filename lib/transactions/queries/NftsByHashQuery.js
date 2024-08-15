"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsByHashQuery = void 0;
const Query_1 = require("./Query");
class NftsByHashQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/get_nfts_hash';
        this.getData = () => ({
            hash: this.props.hash,
            limit: this.props.limit,
            offset: this.props.offset,
        });
    }
}
exports.NftsByHashQuery = NftsByHashQuery;
