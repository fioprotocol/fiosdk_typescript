import { EncryptKeyResponse, PendingFioRequestsDecryptedResponse, PendingFioRequestsResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type PendingFioRequestsQueryProps = {
    fioPublicKey: string;
    limit?: number;
    offset?: number;
    encryptKeys?: Map<string, Array<{
        privateKey: string;
        publicKey: string;
    }>>;
    getEncryptKey: (fioAddress: string) => Promise<EncryptKeyResponse>;
};
export type PendingFioRequestsQueryData = {
    fio_public_key: string;
    limit?: number;
    offset?: number;
};
export declare class PendingFioRequestsQuery extends Query<PendingFioRequestsQueryData, PendingFioRequestsDecryptedResponse | undefined> {
    props: PendingFioRequestsQueryProps;
    ENDPOINT: "chain/get_pending_fio_requests";
    isEncrypted: boolean;
    constructor(config: RequestConfig, props: PendingFioRequestsQueryProps);
    getData: () => {
        fio_public_key: string;
        limit: number | undefined;
        offset: number | undefined;
    };
    decrypt(result: PendingFioRequestsResponse): Promise<PendingFioRequestsDecryptedResponse | undefined>;
}
//# sourceMappingURL=PendingFioRequestsQuery.d.ts.map