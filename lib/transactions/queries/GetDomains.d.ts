import { FioDomainsResponse } from '../../entities/FioDomainsResponse';
import { Query } from './Query';
export declare class GetDomains extends Query<FioDomainsResponse> {
    ENDPOINT: string;
    fioPublicKey: string;
    limit: number | null;
    offset: number | null;
    constructor(fioPublicKey: string, limit?: number | null, offset?: number | null);
    getData(): {
        fio_public_key: string;
        limit: number | null;
        offset: number | null;
    };
}
//# sourceMappingURL=GetDomains.d.ts.map