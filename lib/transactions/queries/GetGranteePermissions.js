"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGranteePermissions = void 0;
const Query_1 = require("./Query");
class GetGranteePermissions extends Query_1.Query {
    constructor(account, limit, offset) {
        super();
        this.ENDPOINT = 'chain/get_grantee_permissions';
        this.accountToUse = account;
        this.limit = limit || null;
        this.offset = offset || null;
    }
    getData() {
        return { grantee_account: this.accountToUse,
            limit: this.limit || null,
            offset: this.offset || null };
    }
}
exports.GetGranteePermissions = GetGranteePermissions;
