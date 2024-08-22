import {FioError} from '../types/FioError'

export type FetchJson = (uri: string, opts?: object) => Promise<object>

export type FioLoggerContextType = 'request'

export type FioLoggerRequestContext = {
    endpoint: string
    body?: string | null
    fetchOptions?: any
    requestTimeout?: number
    res?: any
    error?: FioError,
}

export type FioLogger = (type: FioLoggerContextType, context: FioLoggerRequestContext) => void

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
