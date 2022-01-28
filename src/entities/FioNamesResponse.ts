import { FioAddresses } from './FioAddresses'
import { FioDomain } from './FioDomain'

export interface FioNamesResponse {
  fio_domains: FioDomain[],
  fio_addresses: FioAddresses[]
}
