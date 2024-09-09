import { Api as FioJsApi } from '@fioprotocol/fiojs';
import { AbiProvider, AuthorityProvider } from '@fioprotocol/fiojs/dist/chain-api-interfaces';
import { GetBlockResult, PushTransactionArgs } from '@fioprotocol/fiojs/dist/chain-rpc-interfaces';
import { AbortSignal } from 'abort-controller';
import { AbiResponse, Account, Action, FioInfoResponse, FioLogger, RawRequest } from '../entities';
import { Rule } from '../utils/validation';
type FetchJson = (uri: string, opts?: object) => any;
interface SignedTxArgs {
    compression: number;
    packed_context_free_data: string;
    packed_trx: string;
    signatures: string[];
}
export declare const signAllAuthorityProvider: AuthorityProvider;
export declare const fioApiErrorCodes: number[];
export declare const FIO_CHAIN_INFO_ERROR_CODE = 800;
export declare const FIO_BLOCK_NUMBER_ERROR_CODE = 801;
export type ApiMap = Map<string, AbiResponse>;
export type RequestConfig = {
    fioProvider: FioProvider;
    fetchJson: FetchJson;
    baseUrls: string[];
    logger?: FioLogger;
};
export interface FioProvider {
    prepareTransaction(param: {
        abiMap: ApiMap;
        chainId: string;
        privateKeys: string[];
        textDecoder?: TextDecoder;
        textEncoder?: TextEncoder;
        transaction: RawRequest;
    }): Promise<any>;
    accountHash(pubKey: string): string;
}
export declare class Request {
    protected config: RequestConfig;
    static abiMap: ApiMap;
    protected publicKey: string;
    protected privateKey: string;
    protected validationData: object;
    protected validationRules: Record<string, Rule> | null;
    protected expirationOffset: number;
    protected authPermission: string | undefined;
    protected signingAccount: string | undefined;
    constructor(config: RequestConfig);
    getActor(publicKey?: string): string;
    getChainInfo(): Promise<FioInfoResponse>;
    getBlock(chain: FioInfoResponse): Promise<GetBlockResult>;
    getChainDataForTx(): Promise<{
        chain_id: string;
        ref_block_num: number;
        ref_block_prefix: number;
        expiration: string;
    }>;
    setRawRequestExp(rawRequest: RawRequest, chainData: {
        ref_block_num: number;
        ref_block_prefix: number;
        expiration: string;
    }): void;
    generateApiProvider(abiMap: Map<string, any>): AbiProvider;
    initFioJsApi({ chainId, abiMap, textDecoder, textEncoder, privateKeys, }: {
        chainId: string;
        abiMap: Map<string, any>;
        privateKeys: string[];
        textDecoder?: TextDecoder;
        textEncoder?: TextEncoder;
    }): FioJsApi;
    createRawTransaction({ account, action, authPermission, data, publicKey, chainData, signingAccount }: {
        account: Account;
        action: Action;
        authPermission?: string;
        data: any;
        publicKey?: string;
        chainData?: {
            ref_block_num: number;
            ref_block_prefix: number;
            expiration: string;
        };
        signingAccount?: string;
    }): Promise<RawRequest>;
    serialize({ chainId, abiMap, transaction, textDecoder, textEncoder, }: {
        transaction: RawRequest;
        chainId: string;
        abiMap?: Map<string, any>;
        textDecoder?: TextDecoder;
        textEncoder?: TextEncoder;
    }): Promise<PushTransactionArgs>;
    deserialize({ chainId, abiMap, serializedTransaction, textDecoder, textEncoder, }: {
        serializedTransaction: Uint8Array;
        chainId: string;
        abiMap?: Map<string, any>;
        textDecoder?: TextDecoder;
        textEncoder?: TextEncoder;
    }): Promise<RawRequest>;
    sign({ abiMap, chainId, privateKeys, transaction, serializedTransaction, serializedContextFreeData, }: {
        abiMap?: Map<string, any>;
        chainId: string;
        privateKeys: string[];
        transaction: RawRequest;
        serializedTransaction: any;
        serializedContextFreeData: any;
    }): Promise<SignedTxArgs>;
    pushToServer(transaction: RawRequest, endpoint: string, dryRun: boolean): Promise<any>;
    executeCall({ baseUrl, endPoint, body, fetchOptions, signal, }: {
        baseUrl: string;
        endPoint: string;
        body?: string | null;
        fetchOptions?: any;
        signal: AbortSignal;
    }): Promise<any>;
    multicastServers(req: {
        endpoint: string;
        body?: string | null;
        fetchOptions?: any;
        requestTimeout?: number;
    }): Promise<any>;
    getCipherContent(contentType: string, content: any, privateKey: string, publicKey: string): string;
    getUnCipherContent(contentType: string, content: any, privateKey: string, publicKey: string): any;
    validate(): void;
}
export {};
//# sourceMappingURL=Request.d.ts.map