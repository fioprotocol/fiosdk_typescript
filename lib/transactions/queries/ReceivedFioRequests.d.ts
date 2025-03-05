import { GetEncryptKeyResponse, KeysPair, ReceivedFioRequestsDecryptedResponse, ReceivedFioRequestsResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type ReceivedFioRequestsQueryProps = {
    fioPublicKey: string;
    limit?: number;
    offset?: number;
    includeEncrypted?: boolean;
    encryptKeys?: Map<string, KeysPair[]>;
    getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>;
};
export type ReceivedFioRequestsQueryData = {
    fio_public_key: string;
    limit?: number;
    offset?: number;
};
export declare class ReceivedFioRequests extends Query<ReceivedFioRequestsQueryData, ReceivedFioRequestsDecryptedResponse | undefined> {
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
//# sourceMappingURL=ReceivedFioRequests.d.ts.map