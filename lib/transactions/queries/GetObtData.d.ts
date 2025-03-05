import { GetEncryptKeyResponse, GetObtDataDecryptedResponse, GetObtDataResponse, KeysPair } from '../../entities';
import { RequestConfig } from '../Transactions';
import { Query } from './Query';
export type ObtDataQueryProps = {
    fioPublicKey: string;
    limit?: number;
    offset?: number;
    tokenCode?: string;
    includeEncrypted?: boolean;
    encryptKeys?: Map<string, KeysPair[]>;
    getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>;
};
export type ObtDataQueryData = {
    fio_public_key: string;
    limit?: number;
    offset?: number;
};
export declare class GetObtData extends Query<ObtDataQueryData, GetObtDataDecryptedResponse> {
    ENDPOINT: "chain/get_obt_data";
    isEncrypted: boolean;
    props: ReturnType<GetObtData['getResolvedProps']>;
    constructor(config: RequestConfig, props: ObtDataQueryProps);
    getData: () => {
        fio_public_key: string;
        limit: number | undefined;
        offset: number | undefined;
    };
    getResolvedProps: (props: ObtDataQueryProps) => {
        includeEncrypted: boolean;
        tokenCode: string;
        fioPublicKey: string;
        limit?: number;
        offset?: number;
        encryptKeys?: Map<string, KeysPair[]>;
        getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>;
    };
    decrypt(result: GetObtDataResponse): Promise<GetObtDataDecryptedResponse>;
}
//# sourceMappingURL=GetObtData.d.ts.map