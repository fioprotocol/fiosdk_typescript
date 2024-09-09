import {EndPoint, FioFeeResponse} from '../../entities'
import {feeNoAddressOperation} from '../../utils/constants'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {Query} from './Query'

export type FioFeeQueryProps = {
    endPoint: string
    fioAddress?: string,
}

export type FioFeeQueryData = {
    end_point: string
    fio_address?: string,
}

export class FioFeeQuery extends Query<FioFeeQueryData, FioFeeResponse> {
    public ENDPOINT = `chain/${EndPoint.getFee}` as const

    public props: ReturnType<FioFeeQuery['getResolvedProps']>

    constructor(config: RequestConfig, props: FioFeeQueryProps) {
        super(config)

        this.props = this.getResolvedProps(props)

        if (feeNoAddressOperation.findIndex((element) => element === this.props.endPoint) > -1
            && this.props.fioAddress.length > 0) {
            throw new Error(`End point ${this.props.endPoint} should not have any fio address, when requesting fee`)
        }

        if (props.fioAddress) {
            this.validationData = {fioAddress: this.props.fioAddress}
            this.validationRules = validationRules.getFee
        }
    }

    public getData = () => ({end_point: this.props.endPoint, fio_address: this.props.fioAddress})

    public getResolvedProps = (props: FioFeeQueryProps) => ({
        ...props,
        fioAddress: props.fioAddress ?? '',
    })
}
