import {EndPoint, FioBalanceResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type FioBalanceQueryProps = {
    fioPublicKey?: string,
}

export type FioBalanceQueryData = {
    fio_public_key: string,
}

export class FioBalanceQuery extends Query<FioBalanceQueryData, FioBalanceResponse> {
    public ENDPOINT = `chain/${EndPoint.getFioBalance}` as const

    constructor(config: RequestConfig, public props: FioBalanceQueryProps) {
        super(config)
    }

    public getData = () => ({fio_public_key: this.props.fioPublicKey ?? this.publicKey})

}
