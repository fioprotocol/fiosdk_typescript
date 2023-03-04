import { LocksResponse } from '../../entities/LocksResponse';
import { Query } from './Query';
export declare class GetLocks extends Query<LocksResponse> {
    ENDPOINT: string;
    keyToUse: string;
    constructor(fioPublicKey: string);
    getData(): {
        fio_public_key: string;
    };
}
//# sourceMappingURL=GetLocks.d.ts.map