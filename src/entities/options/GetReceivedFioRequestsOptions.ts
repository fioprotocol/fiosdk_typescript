import {KeysPair} from '../types/KeysPair'

export type GetReceivedFioRequestsOptions = {
    limit?: number | null
    offset?: number | null
    includeEncrypted?: boolean | null
    encryptKeys?: Map<string, KeysPair[]> | null,
}
