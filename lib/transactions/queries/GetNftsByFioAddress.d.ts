import { NftsResponse } from '../../entities/NftsResponse';
import { Query } from './Query';
export declare class GetNftsByFioAddress extends Query<NftsResponse> {
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
//# sourceMappingURL=GetNftsByFioAddress.d.ts.map