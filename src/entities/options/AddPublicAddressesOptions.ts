import {PublicAddress} from '../types/PublicAddress'

export type AddPublicAddressesOptions = {
    fioAddress: string
    maxFee: number
    publicAddresses: PublicAddress[]
    technologyProviderId?: string | null,
}
