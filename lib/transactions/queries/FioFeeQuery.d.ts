import { FioFeeResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type FioFeeQueryProps = {
    endPoint: string;
    fioAddress?: string;
};
export type FioFeeQueryData = {
    end_point: string;
    fio_address?: string;
};
export declare class FioFeeQuery extends Query<FioFeeQueryData, FioFeeResponse> {
    ENDPOINT: "chain/get_fee";
    props: ReturnType<FioFeeQuery['getResolvedProps']>;
    constructor(config: RequestConfig, props: FioFeeQueryProps);
    getData: () => {
        end_point: string;
        fio_address: string;
    };
    getResolvedProps: (props: FioFeeQueryProps) => {
        fioAddress: string;
        endPoint: string;
    };
}
//# sourceMappingURL=FioFeeQuery.d.ts.map