"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGranteePermissions = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class GetGranteePermissions extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getGranteePermissions}`;
        this.getData = () => ({
            grantee_account: this.props.granteeAccount,
            limit: this.props.limit,
            offset: this.props.offset,
        });
    }
}
exports.GetGranteePermissions = GetGranteePermissions;
//# sourceMappingURL=GetGranteePermissions.js.map