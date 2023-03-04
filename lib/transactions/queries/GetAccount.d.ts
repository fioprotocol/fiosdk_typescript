import { AccountResponse } from '../../entities/AccountResponse';
import { Query } from './Query';
export declare class GetAccount extends Query<AccountResponse> {
    ENDPOINT: string;
    accountToUse: string;
    constructor(actor: string);
    getData(): {
        account_name: string;
    };
}
//# sourceMappingURL=GetAccount.d.ts.map