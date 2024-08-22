import { EndPoint } from '../EndPoint';
export type FioOracleFeesResponse = {
    oracle_fees: [
        {
            fee_name: EndPoint.wrapFioDomain;
            fee_amount: number;
        },
        {
            fee_name: EndPoint.wrapFioTokens;
            fee_amount: number;
        }
    ];
};
//# sourceMappingURL=FioOracleFeesResponse.d.ts.map