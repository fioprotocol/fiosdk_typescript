import { FioAddressesResponse } from '../../entities/FioAddressesResponse';
import { Query } from './Query';
export declare class GetAddresses extends Query<FioAddressesResponse> {
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
//# sourceMappingURL=GetAddresses.d.ts.map