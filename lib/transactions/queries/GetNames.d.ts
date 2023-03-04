import { FioNamesResponse } from '../../entities/FioNamesResponse';
import { Query } from './Query';
export declare class GetNames extends Query<FioNamesResponse> {
    ENDPOINT: string;
    fioPublicKey: string;
    constructor(fioPublicKey: string);
    getData(): {
        fio_public_key: string;
    };
}
//# sourceMappingURL=GetNames.d.ts.map