"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGrantorPermissions = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class GetGrantorPermissions extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getGrantorPermissions}`;
        this.getData = () => ({
            grantor_account: this.props.grantorAccount,
            limit: this.props.limit,
            offset: this.props.offset,
        });
    }
}
exports.GetGrantorPermissions = GetGrantorPermissions;
//# sourceMappingURL=GetGrantorPermissions.js.map