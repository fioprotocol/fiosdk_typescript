import {AddBundledResponse} from '../../entities'
import {Constants} from '../../utils/constants'
import {validationRules} from '../../utils/validation'
import {RequestConfig} from '../Request'
import {SignedRequest} from './SignedRequest'

export type AddBundledRequestProps = {
    fioAddress: string;
    bundleSets: number;
    maxFee: number;
    technologyProviderId: string
}

export type AddBundledRequestData = {
    actor: any;
    bundle_sets: number;
    fio_address: string;
    max_fee: number;
    tpid: string;
}

export class AddBundledRequest extends SignedRequest<AddBundledRequestData, AddBundledResponse> {
    public ENDPOINT = 'chain/add_bundled_transactions'
    public ACTION = 'addbundles'
    public ACCOUNT = Constants.defaultAccount

    constructor(config: RequestConfig, public props: AddBundledRequestProps) {
        super(config)

        this.validationData = {fioAddress: props.fioAddress, tpid: props.technologyProviderId}
        this.validationRules = validationRules.registerFioAddress
    }

    public getData = () => ({
        actor: this.getActor(),
        bundle_sets: this.props.bundleSets,
        fio_address: this.props.fioAddress,
        max_fee: this.props.maxFee,
        tpid: this.props.technologyProviderId,
    })
}
