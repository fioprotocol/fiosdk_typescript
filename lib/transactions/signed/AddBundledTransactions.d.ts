import { Account, Action, AddBundledTransactionsResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { SignedTransaction } from './SignedTransaction';
export type AddBundledTransactionsRequestProps = {
    fioAddress: string;
    bundleSets: number;
    maxFee: number;
    technologyProviderId: string;
};
export type AddBundledTransactionsRequestData = {
    actor: any;
    bundle_sets: number;
    fio_address: string;
    max_fee: number;
    tpid: string;
};
export declare class AddBundledTransactions extends SignedTransaction<AddBundledTransactionsRequestData, AddBundledTransactionsResponse> {
    props: AddBundledTransactionsRequestProps;
    ENDPOINT: "chain/add_bundled_transactions";
    ACTION: Action;
    ACCOUNT: Account;
    constructor(config: RequestConfig, props: AddBundledTransactionsRequestProps);
    getData: () => {
        actor: string;
        bundle_sets: number;
        fio_address: string;
        max_fee: number;
        tpid: string;
    };
}
//# sourceMappingURL=AddBundledTransactions.d.ts.map