import {PublicAddress} from '../types/PublicAddress'

export type RemovePublicAddressesOptions = {
    fioAddress: string
    publicAddresses: PublicAddress[]
    maxFee: number
    technologyProviderId?: string | null,
}
