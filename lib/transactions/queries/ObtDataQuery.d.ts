import { EncryptKeyResponse, GetObtDataResponse } from '../../entities';
import { RequestConfig } from '../Request';
import { Query } from './Query';
export type ObtDataQueryProps = {
    fioPublicKey: string;
    limit?: number;
    offset?: number;
    tokenCode?: string;
    includeEncrypted?: boolean;
    encryptKeys?: Map<string, Array<{
        privateKey: string;
        publicKey: string;
    }>>;
    getEncryptKey: (fioAddress: string) => Promise<EncryptKeyResponse>;
};
export type ObtDataQueryData = {
    fio_public_key: string;
    limit?: number;
    offset?: number;
};
export declare class ObtDataQuery extends Query<ObtDataQueryData, GetObtDataResponse> {
    ENDPOINT: "chain/get_obt_data";
    props: ReturnType<ObtDataQuery['getResolvedProps']>;
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
        limit?: number | undefined;
        offset?: number | undefined;
        encryptKeys?: Map<string, {
            privateKey: string;
            publicKey: string;
        }[]> | undefined;
        getEncryptKey: (fioAddress: string) => Promise<EncryptKeyResponse>;
    };
    decrypt(result: GetObtDataResponse): Promise<GetObtDataResponse>;
}
//# sourceMappingURL=ObtDataQuery.d.ts.map