export type FetchJson = (uri: string, opts?: object) => Promise<object>

export type FioSdkOptions = {
    privateKey: string
    publicKey: string
    apiUrls: string[] | string
    fetchJson: FetchJson
    registerMockUrl?: string | null
    technologyProviderId?: string | null
    returnPreparedTrx?: boolean | null,
}
