import { ReceivedFioRequestsResponse } from '../../entities/ReceivedFioRequestsResponse';
import { Query } from './Query';
export declare class ReceivedFioRequests extends Query<ReceivedFioRequestsResponse> {
    ENDPOINT: string;
    fioPublicKey: string;
    limit: number | null;
    offset: number | null;
    includeEncrypted: boolean;
    isEncrypted: boolean;
    constructor(fioPublicKey: string, limit?: number | null, offset?: number | null, includeEncrypted?: boolean);
    getData(): {
        fio_public_key: string;
        limit: number | null;
        offset: number | null;
    };
    decrypt(result: any): any;
}
//# sourceMappingURL=ReceivedFioRequests.d.ts.map