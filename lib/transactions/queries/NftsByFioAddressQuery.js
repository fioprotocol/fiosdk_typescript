"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsByFioAddressQuery = void 0;
const Query_1 = require("./Query");
class NftsByFioAddressQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/get_nfts_fio_address';
        this.getData = () => ({
            fio_address: this.props.fioAddress,
            limit: this.props.limit,
            offset: this.props.offset,
        });
    }
}
exports.NftsByFioAddressQuery = NftsByFioAddressQuery;
