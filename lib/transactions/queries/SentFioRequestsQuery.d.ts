import { EncryptKeyResponse, SentFioRequestsResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type SentFioRequestsQueryProps = {
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
export type SentFioRequestsQueryData = {
    fio_public_key: string;
    limit?: number;
    offset?: number;
};
export declare class SentFioRequestsQuery extends Query<SentFioRequestsQueryData, SentFioRequestsResponse | undefined> {
    props: SentFioRequestsQueryProps;
    ENDPOINT: string;
    constructor(config: RequestConfig, props: SentFioRequestsQueryProps);
    getData: () => {
        fio_public_key: string;
        limit: number | undefined;
        offset: number | undefined;
    };
    decrypt(result: SentFioRequestsResponse): Promise<SentFioRequestsResponse | undefined>;
}
//# sourceMappingURL=SentFioRequestsQuery.d.ts.map