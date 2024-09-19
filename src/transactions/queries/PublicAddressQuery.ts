import {EndPoint, PublicAddressResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type PublicAddressQueryProps = {
    fioAddress: string
    chainCode: string
    tokenCode: string,
}

export type PublicAddressQueryData = {
    fio_address: string,
    chain_code: string,
    token_code: string,
}

export class PublicAddressQuery extends Query<PublicAddressQueryData, PublicAddressResponse> {
    public ENDPOINT = `chain/${EndPoint.getPublicAddress}` as const

    constructor(config: RequestConfig, public props: PublicAddressQueryProps) {
        super(config)
    }

    public getData = () => ({
        chain_code: this.props.chainCode,
        fio_address: this.props.fioAddress,
        token_code: this.props.tokenCode,
    })
}
