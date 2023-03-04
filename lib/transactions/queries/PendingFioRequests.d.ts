import { PendingFioRequestsResponse } from '../../entities/PendingFioRequestsResponse';
import { Query } from './Query';
export declare class PendingFioRequests extends Query<PendingFioRequestsResponse> {
    ENDPOINT: string;
    fioPublicKey: string;
    limit: number | null;
    offset: number | null;
    isEncrypted: boolean;
    constructor(fioPublicKey: string, limit?: number | null, offset?: number | null);
    getData(): {
        fio_public_key: string;
        limit: number | null;
        offset: number | null;
    };
    decrypt(result: any): any;
}
//# sourceMappingURL=PendingFioRequests.d.ts.map