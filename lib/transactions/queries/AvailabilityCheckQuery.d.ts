import { AvailabilityResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type AvailabilityCheckQueryProps = {
    fioName: string;
};
export type AvailabilityCheckQueryData = {
    fio_name: string;
};
export declare class AvailabilityCheckQuery extends Query<AvailabilityCheckQueryData, AvailabilityResponse> {
    props: AvailabilityCheckQueryProps;
    ENDPOINT: "chain/avail_check";
    constructor(config: RequestConfig, props: AvailabilityCheckQueryProps);
    getData: () => {
        fio_name: string;
    };
}
//# sourceMappingURL=AvailabilityCheckQuery.d.ts.map