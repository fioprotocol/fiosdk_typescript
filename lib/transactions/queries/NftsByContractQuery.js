"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsByContractQuery = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class NftsByContractQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getNftsContract}`;
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
//# sourceMappingURL=NftsByContractQuery.js.map