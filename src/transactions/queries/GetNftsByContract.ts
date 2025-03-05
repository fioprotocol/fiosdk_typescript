import {EndPoint, NftsResponse} from '../../entities'
import {RequestConfig} from '../Transactions'
import {Query} from './Query'

export type NftsByContractQueryProps = {
    chainCode: string
    contractAddress: string
    tokenId?: string
    limit?: number
    offset?: number,
}

export type NftsByContractQueryData = {
    chain_code: string
    contract_address: string
    token_id?: string
    limit?: number
    offset?: number,
}

export class GetNftsByContract extends Query<NftsByContractQueryData, NftsResponse> {
    public ENDPOINT = `chain/${EndPoint.getNftsContract}` as const

    constructor(config: RequestConfig, public props: NftsByContractQueryProps) {
        super(config)
    }

    public getData = () => ({
        chain_code: this.props.chainCode,
        contract_address: this.props.contractAddress,
        limit: this.props.limit,
        offset: this.props.offset,
        token_id: this.props.tokenId,
    })
}
