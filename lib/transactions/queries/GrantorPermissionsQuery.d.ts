import { PermissionsResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type GrantorPermissionsQueryProps = {
    grantorAccount: string;
    limit?: number;
    offset?: number;
};
export type GrantorPermissionsQueryData = {
    grantor_account: string;
    limit?: number;
    offset?: number;
};
export declare class GrantorPermissionsQuery extends Query<GrantorPermissionsQueryData, PermissionsResponse> {
    props: GrantorPermissionsQueryProps;
    ENDPOINT: "chain/get_grantor_permissions";
    constructor(config: RequestConfig, props: GrantorPermissionsQueryProps);
    getData: () => {
        grantor_account: string;
        limit: number | undefined;
        offset: number | undefined;
    };
}
//# sourceMappingURL=GrantorPermissionsQuery.d.ts.map