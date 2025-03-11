export type RegisterOwnerFioAddressOptions = {
    fioAddress: string
    ownerPublicKey: string
    maxFee: number
    expirationOffset?: number | null
    technologyProviderId?: string | null,
}
