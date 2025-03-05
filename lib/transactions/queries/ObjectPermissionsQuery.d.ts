import { PermissionsResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type ObjectPermissionsQueryProps = {
    permissionName: string;
    objectName: string;
    limit?: number;
    offset?: number;
};
export type ObjectPermissionsQueryData = {
    permission_name: string;
    object_name: string;
    limit?: number;
    offset?: number;
};
export declare class ObjectPermissionsQuery extends Query<ObjectPermissionsQueryData, PermissionsResponse> {
    props: ObjectPermissionsQueryProps;
    ENDPOINT: "chain/get_object_permissions";
    constructor(config: RequestConfig, props: ObjectPermissionsQueryProps);
    getData: () => {
        limit: number | undefined;
        object_name: string;
        offset: number | undefined;
        permission_name: string;
    };
}
//# sourceMappingURL=ObjectPermissionsQuery.d.ts.map