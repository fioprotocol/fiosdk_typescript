import { Query } from './Query'
import { NftsResponse } from '../../entities/NftsResponse'


export class GetNftsByContract extends Query<NftsResponse> {
  ENDPOINT: string = 'chain/get_nfts_contract'
  chainCode: string
  contractAddress: string
  tokenId: string | null
  limit: number | null
  offset: number | null


  constructor(chainCode: string, contractAddress: string, tokenId?: string, limit?: number, offset?: number) {
    super()
    this.chainCode = chainCode
    this.contractAddress = contractAddress
    this.tokenId = tokenId || null
    this.limit = limit || null
    this.offset = offset || null
  }

  getData() {
    return {
      chain_code: this.chainCode,
      contract_address: this.contractAddress,
      token_id: this.tokenId,
      limit: this.limit || null,
      offset: this.offset || null
    }
  }
}
