import { AbortSignal } from 'abort-controller';
import { Authorization, EncryptKeyResponse, RawAction, RawRequest } from '../entities';
export declare function asyncWaterfall({ asyncFunctions, requestTimeout, }: {
    asyncFunctions: Array<(signal: AbortSignal) => Promise<any>>;
    requestTimeout?: number;
}): Promise<any>;
export declare function getEncryptKeyForUnCipherContent({ getEncryptKey, method, fioAddress, }: {
    getEncryptKey: (fioAddress: string) => Promise<EncryptKeyResponse>;
    method?: string;
    fioAddress: string;
}): Promise<string | null>;
export type CleanObject<T extends Record<string, unknown>, K extends keyof T = keyof T> = {
    [FK in K]: NonNullable<T[FK]>;
};
export declare const cleanupObject: <T extends Record<string, unknown>>(obj: T) => CleanObject<T, keyof T>;
export type ResolveArgsSettings<T extends Record<string, unknown>> = {
    keys: Array<keyof T | '$base'>;
    arguments: IArguments;
};
export declare const resolveOptions: <T extends Record<string, unknown>>(options: ResolveArgsSettings<T>) => CleanObject<T, keyof T>;
export declare const createAuthorization: (actor: string, permission?: string) => Authorization;
export declare const createRawAction: (data: Pick<RawAction, 'data' | 'actor'> & Partial<Pick<RawAction, 'account' | 'name' | 'authorization'>>) => RawAction;
export declare const createRawRequest: (data: Partial<RawRequest>) => RawRequest;
//# sourceMappingURL=utils.d.ts.map