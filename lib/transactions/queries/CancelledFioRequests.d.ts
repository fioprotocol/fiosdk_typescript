import { CancelledFioRequestResponse } from '../../entities/CancelledFioRequestResponse';
import { Query } from './Query';
export declare class CancelledFioRequests extends Query<CancelledFioRequestResponse> {
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
//# sourceMappingURL=CancelledFioRequests.d.ts.map