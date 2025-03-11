import {EndPoint, LocksResponse} from '../../entities'
import {RequestConfig} from '../Transactions'
import {Query} from './Query'

export type LocksQueryProps = {
    fioPublicKey: string,
}

export type LocksQueryData = {
    fio_public_key: string,
}

export class GetLocks extends Query<LocksQueryData, LocksResponse> {
    public ENDPOINT = `chain/${EndPoint.getLocks}` as const

    constructor(config: RequestConfig, public props: LocksQueryProps) {
        super(config)
    }

    public getData = () => ({fio_public_key: this.props.fioPublicKey})
}
