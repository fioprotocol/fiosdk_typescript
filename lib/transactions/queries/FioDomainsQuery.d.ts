import { FioDomainsResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type FioDomainsQueryProps = {
    fioPublicKey: string;
    limit?: number;
    offset?: number;
};
export type FioDomainsQueryData = {
    fio_public_key: string;
    limit?: number;
    offset?: number;
};
export declare class FioDomainsQuery extends Query<FioDomainsQueryData, FioDomainsResponse> {
    props: FioDomainsQueryProps;
    ENDPOINT: "chain/get_fio_domains";
    constructor(config: RequestConfig, props: FioDomainsQueryProps);
    getData: () => {
        fio_public_key: string;
        limit: number | undefined;
        offset: number | undefined;
    };
}
//# sourceMappingURL=FioDomainsQuery.d.ts.map