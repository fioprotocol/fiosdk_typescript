import { GetObtDataResponse } from '../../entities/GetObtDataResponse';
import { Query } from './Query';
export declare class GetObtData extends Query<GetObtDataResponse> {
    ENDPOINT: string;
    fio_public_key: string;
    limit: number | null;
    offset: number | null;
    tokenCode: string;
    isEncrypted: boolean;
    constructor(fioPublicKey: string, limit?: number, offset?: number, tokenCode?: string);
    getData(): {
        fio_public_key: string;
        limit: number | null;
        offset: number | null;
    };
    decrypt(result: any): any;
}
//# sourceMappingURL=GetObtData.d.ts.map