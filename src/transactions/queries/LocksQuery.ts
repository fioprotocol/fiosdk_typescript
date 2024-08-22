import {EndPoint, LocksResponse} from '../../entities'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type LocksQueryProps = {
    fioPublicKey: string,
}

export type LocksQueryData = {
    fio_public_key: string,
}

export class LocksQuery extends Query<LocksQueryData, LocksResponse> {
    public ENDPOINT = `chain/${EndPoint.getLocks}` as const

    constructor(config: RequestConfig, public props: LocksQueryProps) {
        super(config)
    }

    public getData = () => ({fio_public_key: this.props.fioPublicKey})
}
