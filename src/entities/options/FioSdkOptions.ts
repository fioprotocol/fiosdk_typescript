import {ExecuteCallError} from '../types/ExecuteCallError'
import {FioError} from '../types/FioError'
import {ErrObj} from '../utils/ErrObj'

export type FetchJson = (uri: string, opts?: object) => Promise<object>

export type FioLoggerRequestContext = {
    endpoint: string
    body?: string | null
    fetchOptions?: any
    requestTimeout?: number
    res?: any
    error?: FioError,
}

export type FioLoggerExecuteContext = {
    endpoint: string
    error?: ExecuteCallError,
}

export type FioLoggerValidationContext = {
    name: string
    errors?: ErrObj[],
}

export type FioLoggerDecryptContext = {
    error?: Error,
}

export type FioLoggerMessage = {
    type: 'request'
    context: FioLoggerRequestContext,
} | {
    type: 'execute',
    context: FioLoggerExecuteContext,
} | {
    type: 'validation'
    context: FioLoggerValidationContext,
} | {
    type: 'decrypt'
    context: FioLoggerDecryptContext,
}

export type FioLogger = (message: FioLoggerMessage) => void

export type FioSdkOptions = {
    privateKey?: string
    publicKey?: string
    apiUrls: string[] | string
    fetchJson: FetchJson
    registerMockUrl?: string | null
    technologyProviderId?: string | null
    returnPreparedTrx?: boolean | null
    throwValidationErrors?: boolean | null
    logger?: FioLogger | null,
}
