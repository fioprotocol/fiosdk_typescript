"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPermissionsQuery = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class ObjectPermissionsQuery extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getObjectPermissions}`;
        this.getData = () => ({
            limit: this.props.limit,
            object_name: this.props.objectName,
            offset: this.props.offset,
            permission_name: this.props.permissionName,
        });
    }
}
exports.ObjectPermissionsQuery = ObjectPermissionsQuery;
//# sourceMappingURL=ObjectPermissionsQuery.js.map