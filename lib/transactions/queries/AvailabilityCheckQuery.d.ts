import { AvailabilityCheckResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type AvailabilityCheckQueryProps = {
    fioName: string;
};
export type AvailabilityCheckQueryData = {
    fio_name: string;
};
export declare class AvailabilityCheckQuery extends Query<AvailabilityCheckQueryData, AvailabilityCheckResponse> {
    props: AvailabilityCheckQueryProps;
    ENDPOINT: string;
    constructor(config: RequestConfig, props: AvailabilityCheckQueryProps);
    getData: () => {
        fio_name: string;
    };
}
//# sourceMappingURL=AvailabilityCheckQuery.d.ts.map