import { PublicAddressResponse } from '../../entities/PublicAddressResponse';
import { Query } from './Query';
export declare class GetPublicAddress extends Query<PublicAddressResponse> {
    ENDPOINT: string;
    fioAddress: string;
    chainCode: string;
    tokenCode: string;
    constructor(fioAddress: string, chainCode: string, tokenCode: string);
    getData(): {
        fio_address: string;
        chain_code: string;
        token_code: string;
    };
}
//# sourceMappingURL=GetPublicAddress.d.ts.map