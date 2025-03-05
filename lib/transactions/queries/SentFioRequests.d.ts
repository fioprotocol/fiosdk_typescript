import { GetEncryptKeyResponse, KeysPair, SentFioRequestsDecryptedResponse, SentFioRequestsResponse } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type SentFioRequestsQueryProps = {
    fioPublicKey: string;
    limit?: number;
    offset?: number;
    includeEncrypted?: boolean;
    encryptKeys?: Map<string, KeysPair[]>;
    getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>;
};
export type SentFioRequestsQueryData = {
    fio_public_key: string;
    limit?: number;
    offset?: number;
};
export declare class SentFioRequests extends Query<SentFioRequestsQueryData, SentFioRequestsDecryptedResponse | undefined> {
    props: SentFioRequestsQueryProps;
    ENDPOINT: "chain/get_sent_fio_requests";
    isEncrypted: boolean;
    constructor(config: RequestConfig, props: SentFioRequestsQueryProps);
    getData: () => {
        fio_public_key: string;
        limit: number | undefined;
        offset: number | undefined;
    };
    decrypt(result: SentFioRequestsResponse): Promise<SentFioRequestsDecryptedResponse | undefined>;
}
//# sourceMappingURL=SentFioRequests.d.ts.map