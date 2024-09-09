import { EncryptKeyResponse, ReceivedFioRequestsDecryptedResponse, ReceivedFioRequestsResponse } from '../../entities';
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
export declare class ReceivedFioRequestsQuery extends Query<ReceivedFioRequestsQueryData, ReceivedFioRequestsDecryptedResponse | undefined> {
    props: ReceivedFioRequestsQueryProps;
    ENDPOINT: "chain/get_received_fio_requests";
    isEncrypted: boolean;
    constructor(config: RequestConfig, props: ReceivedFioRequestsQueryProps);
    getData: () => {
        fio_public_key: string;
        limit: number | undefined;
        offset: number | undefined;
    };
    decrypt(result: ReceivedFioRequestsResponse): Promise<ReceivedFioRequestsDecryptedResponse | undefined>;
}
//# sourceMappingURL=ReceivedFioRequestsQuery.d.ts.map