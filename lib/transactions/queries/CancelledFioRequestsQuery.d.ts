import { CancelledFioRequestsResponse, EncryptKeyResponse, KeysPair } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type CancelledFioRequestsQueryProps = {
    fioPublicKey: string;
    limit?: number;
    offset?: number;
    encryptKeys?: Map<string, KeysPair[]>;
    getEncryptKey: (fioAddress: string) => Promise<EncryptKeyResponse>;
};
export type CancelledFioRequestsQueryData = {
    fio_public_key: string;
    limit?: number;
    offset?: number;
};
export declare class CancelledFioRequestsQuery extends Query<CancelledFioRequestsQueryData, CancelledFioRequestsResponse | undefined> {
    props: CancelledFioRequestsQueryProps;
    ENDPOINT: string;
    isEncrypted: boolean;
    constructor(config: RequestConfig, props: CancelledFioRequestsQueryProps);
    getData: () => {
        fio_public_key: string;
        limit: number | undefined;
        offset: number | undefined;
    };
    decrypt(result: CancelledFioRequestsResponse): Promise<CancelledFioRequestsResponse | undefined>;
}
//# sourceMappingURL=CancelledFioRequestsQuery.d.ts.map