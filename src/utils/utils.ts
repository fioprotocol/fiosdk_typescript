import {Fio} from '@fioprotocol/fiojs'
import AbortController, {AbortSignal} from 'abort-controller'
import {TextDecoder, TextEncoder} from 'text-encoding'
import {Authorization, ContentType, EncryptKeyResponse, RawAction, RawRequest} from '../entities'

const DEFAULT_REQUEST_TIMEOUT = 60000

export async function asyncWaterfall({
    asyncFunctions,
    requestTimeout = DEFAULT_REQUEST_TIMEOUT,
}: {
    asyncFunctions: Array<(signal: AbortSignal) => Promise<any>>
    requestTimeout?: number,
}): Promise<any> {
    const timeoutIds: NodeJS.Timeout[] = []

    try {
        for (let i = 0; i < asyncFunctions.length; i++) {
            const func = asyncFunctions[i]
            const abortController = new AbortController()
            let timeoutId: NodeJS.Timeout | undefined

            const timeoutPromise = new Promise<void>((_, reject) => {
                timeoutId = setTimeout(() => {
                    abortController.abort()
                    reject(new Error('request_timeout'))
                }, requestTimeout)
                timeoutIds.push(timeoutId!)
            })

            try {
                const result = await Promise.race([func(abortController.signal), timeoutPromise])
                clearTimeout(timeoutId!)
                if (result.isError) {
                    throw result.data
                }
                if (result !== undefined) {
                    return result
                }
            } catch (error: any) {
                clearTimeout(timeoutId!)
                if (i === asyncFunctions.length - 1) {
                    throw error
                }
            }
        }
    } finally {
        timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId))
    }
}

export async function getEncryptKeyForUnCipherContent({
    getEncryptKey,
    method = '',
    fioAddress,
}: {
    getEncryptKey: (fioAddress: string) => Promise<EncryptKeyResponse>,
    method?: string,
    fioAddress: string;
}) {
    let encryptKey = null

    if (fioAddress) {
        try {
            const encryptKeyRes = await getEncryptKey(fioAddress)
            if (encryptKeyRes && encryptKeyRes.encrypt_public_key) {
                encryptKey = encryptKeyRes.encrypt_public_key
            }
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.warn(`${method}: Get Encrypt Key fio_address ${fioAddress} failed.`)
            // Skip if getEncryptKey fails and continue with the publicKey
        }
    }

    return encryptKey
}

export type CleanObject<T extends Record<string, unknown>, K extends keyof T = keyof T> = {
    [FK in K]: NonNullable<T[FK]>
}

export const cleanupObject = <T extends Record<string, unknown>>(
    obj: T,
): CleanObject<T> => {
    const result = {...obj}
    Object.keys(result).forEach((key) => {
        if (result[key] === null || result[key] === undefined) {
            delete result[key]
        }
    })
    return result as CleanObject<T>
}

export type ResolveArgsSettings<T extends Record<string, unknown>> = {
    keys: Array<keyof T | '$base'>
    arguments: IArguments,
}

export const resolveOptions = <T extends Record<string, unknown>>(options: ResolveArgsSettings<T>): CleanObject<T> => {
    if (options.arguments.length === 0) {
        return {} as CleanObject<T>
    }
    if (options.arguments.length === 1
        && typeof options.arguments[0] === 'object'
        && typeof options.arguments[0] !== null
        && !Array.isArray(options.arguments[0])
    ) {
        return cleanupObject(options.arguments[0] as T)
    }
    let result: Record<string, unknown> = {}
    for (const key of options.keys) {
        const i = options.keys.indexOf(key)
        if (key === '$base') {
            const base = options.arguments[i]
            if (!base) {
                continue
            }
            if (typeof base !== 'object' || Array.isArray(base)) {
                throw new Error('Not supported base field')
            }
            result = {...result, ...options.arguments[i]}
        } else {
            result[key as string] = options.arguments[i]
        }
    }
    return cleanupObject(result as T)
}

export const createAuthorization = (actor: string, permission = 'active'): Authorization => ({
    actor,
    permission,
})

export const createRawAction = (
    data: Pick<RawAction, 'data' | 'actor' | 'account' | 'name'> & Partial<Pick<RawAction, 'authorization'>>,
): RawAction => ({
    account: data.account,
    actor: data.actor,
    authorization: data.authorization ?? [],
    data: data.data,
    name: data.name,
})

export const createRawRequest = (data: Partial<RawRequest>): RawRequest => ({
    actions: data.actions ?? [],
    context_free_actions: data.context_free_actions ?? [],
    delay_sec: data.delay_sec ?? 0,
    expiration: data.expiration ?? '',
    max_cpu_usage_ms: data.max_cpu_usage_ms ?? 0,
    max_net_usage_words: data.max_net_usage_words ?? 0,
    ref_block_num: data.ref_block_num ?? 0,
    ref_block_prefix: data.ref_block_prefix ?? 0,
    transaction_extensions: data.transaction_extensions ?? [],
})

export const defaultTextEncoder: TextEncoder = new TextEncoder()
export const defaultTextDecoder: TextDecoder = new TextDecoder()

export const getCipherContent = (contentType: ContentType, content: any, privateKey: string, publicKey: string) => {
    const cipher = Fio.createSharedCipher({
        privateKey,
        publicKey,
        textDecoder: defaultTextDecoder,
        textEncoder: defaultTextEncoder,
    })
    return cipher.encrypt(contentType, content)
}

export const getUnCipherContent = (contentType: ContentType, content: any, privateKey: string, publicKey: string) => {
    const cipher = Fio.createSharedCipher({
        privateKey,
        publicKey,
        textDecoder: defaultTextDecoder,
        textEncoder: defaultTextEncoder,
    })
    return cipher.decrypt(contentType, content)
}
