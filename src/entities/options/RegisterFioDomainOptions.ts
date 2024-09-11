export type RegisterFioDomainOptions = {
    fioDomain: string
    maxFee: number
    ownerPublicKey?: string
    technologyProviderId?: string | null
    expirationOffset?: number | null,
}
