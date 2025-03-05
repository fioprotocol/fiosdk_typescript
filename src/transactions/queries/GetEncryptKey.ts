import {GetEncryptKeyResponse, EndPoint} from '../../entities'
import {RequestConfig} from '../Transactions'
import {Query} from './Query'

export type EncryptKeyQueryProps = {
    fioAddress: string,
}

export type EncryptKeyQueryData = {
    fio_address: string;
}

export class GetEncryptKey extends Query<EncryptKeyQueryData, GetEncryptKeyResponse> {
    public ENDPOINT = `chain/${EndPoint.getEncryptKey}` as const

    constructor(config: RequestConfig, public props: EncryptKeyQueryProps) {
        super(config)
    }

    public getData = () => ({fio_address: this.props.fioAddress})
}
