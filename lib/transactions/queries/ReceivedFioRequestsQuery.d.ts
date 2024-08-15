import { EncryptKeyResponse, ReceivedFioRequestsResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type ReceivedFioRequestsQueryProps = {
    fioPublicKey: string;
    limit?: number;
    offset?: number;
    includeEncrypted?: boolean;
    encryptKeys?: Map<string, Array<{
        privateKey: string;
        publicKey: string;
    }>>;
    getEncryptKey: (fioAddress: string) => Promise<EncryptKeyResponse>;
};
export type ReceivedFioRequestsQueryData = {
    fio_public_key: string;
    limit?: number;
    offset?: number;
};
export declare class ReceivedFioRequestsQuery extends Query<ReceivedFioRequestsQueryData, ReceivedFioRequestsResponse | undefined> {
    props: ReceivedFioRequestsQueryProps;
    ENDPOINT: string;
    constructor(config: RequestConfig, props: ReceivedFioRequestsQueryProps);
    getData: () => {
        fio_public_key: string;
        limit: number | undefined;
        offset: number | undefined;
    };
    decrypt(result: ReceivedFioRequestsResponse): Promise<ReceivedFioRequestsResponse | undefined>;
}
//# sourceMappingURL=ReceivedFioRequestsQuery.d.ts.map