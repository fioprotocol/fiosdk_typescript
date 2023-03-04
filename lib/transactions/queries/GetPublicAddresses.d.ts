import { PublicAddressesResponse } from '../../entities/PublicAddressesResponse';
import { Query } from './Query';
export declare class GetPublicAddresses extends Query<PublicAddressesResponse> {
    ENDPOINT: string;
    fioAddress: string;
    limit: number | null;
    offset: number | null;
    constructor(fioAddress: string, limit?: number, offset?: number);
    getData(): {
        fio_address: string;
        limit: number | null;
        offset: number | null;
    };
}
//# sourceMappingURL=GetPublicAddresses.d.ts.map