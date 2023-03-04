import { AbiResponse } from '../../entities/AbiResponse';
import { Query } from './Query';
export declare class GetAbi extends Query<AbiResponse> {
    ENDPOINT: string;
    accountName: string;
    constructor(accountName: string);
    getData(): {
        account_name: string;
    };
}
//# sourceMappingURL=GetAbi.d.ts.map