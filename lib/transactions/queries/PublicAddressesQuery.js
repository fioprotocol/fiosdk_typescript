"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAddressesQuery = void 0;
const Query_1 = require("./Query");
class PublicAddressesQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/get_pub_addresses';
        this.getData = () => ({
            fio_address: this.props.fioAddress,
            limit: this.props.limit,
            offset: this.props.offset,
        });
    }
}
exports.PublicAddressesQuery = PublicAddressesQuery;
