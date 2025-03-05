import {EndPoint, BalanceResponse} from '../../entities'
import {RequestConfig} from '../Transactions'
import {Query} from './Query'

export type FioBalanceQueryProps = {
    fioPublicKey?: string,
}

export type FioBalanceQueryData = {
    fio_public_key: string,
}

export class GetFioBalance extends Query<FioBalanceQueryData, BalanceResponse> {
    public ENDPOINT = `chain/${EndPoint.getFioBalance}` as const

    constructor(config: RequestConfig, public props: FioBalanceQueryProps) {
        super(config)
    }

    public getData = () => ({fio_public_key: this.props.fioPublicKey ?? this.publicKey})

}
