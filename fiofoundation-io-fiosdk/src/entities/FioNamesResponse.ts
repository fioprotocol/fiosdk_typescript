import { FioDomain } from './FioDomain'
import { FioAddresses } from './FioAddresses'

export interface FioNamesResponse {
  fio_domains: FioDomain[],
  fio_addresses: FioAddresses[]
}