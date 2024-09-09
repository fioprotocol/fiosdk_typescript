import {FioAddress} from '../types/FioAddress'
import {FioDomain} from '../types/FioDomain'

export type FioNamesResponse = {
    fio_domains: FioDomain[]
    fio_addresses: FioAddress[],
}
