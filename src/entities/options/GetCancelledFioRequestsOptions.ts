import {KeysPair} from '../types/KeysPair'

export type GetCancelledFioRequestsOptions = {
    limit?: number | null
    offset?: number | null
    encryptKeys?: Map<string, KeysPair[]> | null,
}
