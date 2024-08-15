import {EncryptKeyResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type EncryptKeyQueryProps = {
    fioAddress: string,
}

export type EncryptKeyQueryData = {
    fio_address: string;
}

export class EncryptKeyQuery extends Query<EncryptKeyQueryData, EncryptKeyResponse> {
    public ENDPOINT = 'chain/get_encrypt_key'

    constructor(config: RequestConfig, public props: EncryptKeyQueryProps) {
        super(config)
    }

    public getData = () => ({fio_address: this.props.fioAddress})
}
