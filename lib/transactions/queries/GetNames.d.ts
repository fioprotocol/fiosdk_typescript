import { FioNamesResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type FioNamesQueryProps = {
    fioPublicKey: string;
};
export type FioNamesQueryData = {
    fio_public_key: string;
};
export declare class GetNames extends Query<FioNamesQueryData, FioNamesResponse> {
    props: FioNamesQueryProps;
    ENDPOINT: "chain/get_fio_names";
    constructor(config: RequestConfig, props: FioNamesQueryProps);
    getData: () => {
        fio_public_key: string;
    };
}
//# sourceMappingURL=GetNames.d.ts.map