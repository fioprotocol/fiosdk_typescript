import { EndPoint } from '../entities';
/**
 * @deprecated use {@link EndPoint}
 */
export declare const endPoints: {
    AddPublicAddress: EndPoint;
    PushTransaction: EndPoint;
    RecordObtData: EndPoint;
    RegisterFioAddress: EndPoint;
    RegisterFioDomain: EndPoint;
    RegisterFioDomainAddress: EndPoint;
    RejectFundsRequest: EndPoint;
    RequestNewFunds: EndPoint;
    SetFioDomainVisibility: EndPoint;
    StakeFioTokens: EndPoint;
    TransferTokensFioAddress: EndPoint;
    TransferTokensKey: EndPoint;
    UnStakeFioTokens: EndPoint;
};
export declare const feeNoAddressOperation: string[];
/**
 * @deprecated use {@link Account}
 */
export declare const rawAbiAccountName: string[];
export declare const multiplier = 1000000000;
export declare const defaultAccount: string;
export declare const defaultExpirationOffset = 180;
export declare const classMethodsToExcludeFromProxy: string[];
export declare const missingAbiError = "unknown key";
//# sourceMappingURL=constants.d.ts.map