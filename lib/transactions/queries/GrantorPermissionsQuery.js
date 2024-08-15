"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantorPermissionsQuery = void 0;
const Query_1 = require("./Query");
class GrantorPermissionsQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/get_grantor_permissions';
        this.getData = () => ({
            grantor_account: this.props.grantorAccount,
            limit: this.props.limit,
            offset: this.props.offset,
        });
    }
}
exports.GrantorPermissionsQuery = GrantorPermissionsQuery;
