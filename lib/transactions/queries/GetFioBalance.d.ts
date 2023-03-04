import { BalanceResponse } from '../../entities/BalanceResponse';
import { Query } from './Query';
export declare class GetFioBalance extends Query<BalanceResponse> {
    ENDPOINT: string;
    keyToUse: string;
    constructor(othersBalance?: string);
    getData(): {
        fio_public_key: string;
    };
}
//# sourceMappingURL=GetFioBalance.d.ts.map