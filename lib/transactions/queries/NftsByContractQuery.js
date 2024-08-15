"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsByContractQuery = void 0;
const Query_1 = require("./Query");
class NftsByContractQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/get_nfts_contract';
        this.getData = () => ({
            chain_code: this.props.chainCode,
            contract_address: this.props.contractAddress,
            limit: this.props.limit,
            offset: this.props.offset,
            token_id: this.props.tokenId,
        });
    }
}
exports.NftsByContractQuery = NftsByContractQuery;
