import { PermissionsResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type GranteePermissionsQueryProps = {
    granteeAccount: string;
    limit?: number;
    offset?: number;
};
export type GranteePermissionsQueryData = {
    grantee_account: string;
    limit?: number;
    offset?: number;
};
export declare class GranteePermissionsQuery extends Query<GranteePermissionsQueryData, PermissionsResponse> {
    props: GranteePermissionsQueryProps;
    ENDPOINT: "chain/get_grantee_permissions";
    constructor(config: RequestConfig, props: GranteePermissionsQueryProps);
    getData: () => {
        grantee_account: string;
        limit: number | undefined;
        offset: number | undefined;
    };
}
//# sourceMappingURL=GranteePermissionsQuery.d.ts.map