"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsByFioAddressQuery = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class NftsByFioAddressQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getNftsFioAddress}`;
        this.getData = () => ({
            fio_address: this.props.fioAddress,
            limit: this.props.limit,
            offset: this.props.offset,
        });
    }
}
exports.NftsByFioAddressQuery = NftsByFioAddressQuery;
//# sourceMappingURL=NftsByFioAddressQuery.js.map