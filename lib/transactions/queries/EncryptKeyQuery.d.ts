import { GetEncryptKeyResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type EncryptKeyQueryProps = {
    fioAddress: string;
};
export type EncryptKeyQueryData = {
    fio_address: string;
};
export declare class EncryptKeyQuery extends Query<EncryptKeyQueryData, GetEncryptKeyResponse> {
    props: EncryptKeyQueryProps;
    ENDPOINT: "chain/get_encrypt_key";
    constructor(config: RequestConfig, props: EncryptKeyQueryProps);
    getData: () => {
        fio_address: string;
    };
}
//# sourceMappingURL=EncryptKeyQuery.d.ts.map