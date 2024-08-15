import { PermissionsResponse } from '../../entities';
import { RequestConfig } from '../Request';
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
    ENDPOINT: string;
    constructor(config: RequestConfig, props: GranteePermissionsQueryProps);
    getData: () => {
        grantee_account: string;
        limit: number | undefined;
        offset: number | undefined;
    };
}
//# sourceMappingURL=GranteePermissionsQuery.d.ts.map