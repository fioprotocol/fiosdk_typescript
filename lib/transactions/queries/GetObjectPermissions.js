"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetObjectPermissions = void 0;
const Query_1 = require("./Query");
class GetObjectPermissions extends Query_1.Query {
    constructor(permissionName, objectName, limit, offset) {
        super();
        this.ENDPOINT = 'chain/get_object_permissions';
        this.permissionNameToUse = permissionName;
        this.objectNameToUse = objectName;
        this.limit = limit || null;
        this.offset = offset || null;
    }
    getData() {
        return { permission_name: this.permissionNameToUse,
            object_name: this.objectNameToUse,
            limit: this.limit || null,
            offset: this.offset || null };
    }
}
exports.GetObjectPermissions = GetObjectPermissions;
