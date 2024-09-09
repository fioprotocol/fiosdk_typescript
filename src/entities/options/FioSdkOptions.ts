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

export type FioLoggerValidationContext = {
    name: string
    errors?: ErrObj[],
}

export type FioLoggerMessage = {
    type: 'request'
    context: FioLoggerRequestContext,
} | {
    type: 'validation'
    context: FioLoggerValidationContext,
}

export type FioLogger = (message: FioLoggerMessage) => void

export type FioSdkOptions = {
    privateKey: string
    publicKey: string
    apiUrls: string[] | string
    fetchJson: FetchJson
    registerMockUrl?: string | null
    technologyProviderId?: string | null
    returnPreparedTrx?: boolean | null
    throwValidationErrors?: boolean | null
    logger?: FioLogger | null,
}
