"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GranteePermissionsQuery = void 0;
const Query_1 = require("./Query");
class GranteePermissionsQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = 'chain/get_grantee_permissions';
        this.getData = () => ({
            grantee_account: this.props.granteeAccount,
            limit: this.props.limit,
            offset: this.props.offset,
        });
    }
}
exports.GranteePermissionsQuery = GranteePermissionsQuery;
