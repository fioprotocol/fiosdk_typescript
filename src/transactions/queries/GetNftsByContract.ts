import { NftsResponse } from '../../entities/NftsResponse'
import { Query } from './Query'

export class GetNftsByContract extends Query<NftsResponse> {
  public ENDPOINT: string = 'chain/get_nfts_contract'
  public chainCode: string
  public contractAddress: string
  public tokenId: string | null
  public limit: number | null
  public offset: number | null

  constructor(chainCode: string, contractAddress: string, tokenId?: string, limit?: number, offset?: number) {
    super()
    this.chainCode = chainCode
    this.contractAddress = contractAddress
    this.tokenId = tokenId || null
    this.limit = limit || null
    this.offset = offset || null
  }

  public getData() {
    return {
      chain_code: this.chainCode,
      contract_address: this.contractAddress,
      token_id: this.tokenId,
      limit: this.limit || null,
      offset: this.offset || null,
    }
  }
}
