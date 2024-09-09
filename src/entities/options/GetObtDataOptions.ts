import {KeysPair} from '../types/KeysPair'

export type GetObtDataOptions = {
    includeEncrypted?: boolean | null
    limit?: number | null
    offset?: number | null
    tokenCode?: string | null
    encryptKeys?: Map<string, KeysPair[]> | null,
}
