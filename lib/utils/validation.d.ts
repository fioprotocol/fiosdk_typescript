import { ErrObj } from '../entities';
export type Rule = {
    length?: {
        min?: number;
        max: number;
    };
    matchParams?: {
        opt?: string;
        regex: string;
    };
    required?: boolean;
    type: StringConstructor | NumberConstructor | ObjectConstructor | BooleanConstructor;
};
export declare const allRules: {
    chain: {
        length: {
            min: number;
            max: number;
        };
        matchParams: {
            opt: string;
            regex: string;
        };
        required: true;
        type: StringConstructor;
    };
    fioAddress: {
        length: {
            min: number;
            max: number;
        };
        matchParams: {
            opt: string;
            regex: string;
        };
        required: true;
        type: StringConstructor;
    };
    fioDomain: {
        length: {
            min: number;
            max: number;
        };
        matchParams: {
            opt: string;
            regex: string;
        };
        required: true;
        type: StringConstructor;
    };
    fioPublicKey: {
        length: {
            min: number;
            max: number;
        };
        matchParams: {
            regex: string;
        };
        required: true;
        type: StringConstructor;
    };
    nativeBlockchainPublicAddress: {
        length: {
            min: number;
            max: number;
        };
        matchParams: {
            regex: string;
        };
        required: true;
        type: StringConstructor;
    };
    tpid: {
        length: {
            min: number;
            max: number;
        };
        matchParams: {
            opt: string;
            regex: string;
        };
        type: StringConstructor;
    };
};
export declare const validationRules: {
    addPublicAddressRules: {
        fioAddress: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            type: StringConstructor;
        };
    };
    cancelFundsRequestRules: {
        tpid: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            type: StringConstructor;
        };
    };
    getFee: {
        fioAddress: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            required: true;
            type: StringConstructor;
        };
    };
    newFundsRequest: {
        payeeFioAddress: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            required: true;
            type: StringConstructor;
        };
        payerFioAddress: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            required: true;
            type: StringConstructor;
        };
        tokenCode: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            type: StringConstructor;
        };
    };
    recordObtData: {
        payeeFioAddress: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            required: true;
            type: StringConstructor;
        };
        payerFioAddress: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            required: true;
            type: StringConstructor;
        };
        tokenCode: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            type: StringConstructor;
        };
    };
    registerFioAddress: {
        fioAddress: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            type: StringConstructor;
        };
    };
    registerFioDomain: {
        fioDomain: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            type: StringConstructor;
        };
    };
    registerFioDomainAddress: {
        fioAddress: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            type: StringConstructor;
        };
    };
    rejectFunds: {
        tpid: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            type: StringConstructor;
        };
    };
    renewFioAddress: {
        fioAddress: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            type: StringConstructor;
        };
    };
    renewFioDomain: {
        fioDomain: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            type: StringConstructor;
        };
    };
    setFioDomainVisibility: {
        fioDomain: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            type: StringConstructor;
        };
    };
    transferLockedTokensRequest: {
        tpid: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            type: StringConstructor;
        };
    };
    transferTokens: {
        tpid: {
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                opt: string;
                regex: string;
            };
            type: StringConstructor;
        };
    };
};
export declare function validate(data: any, rules: Record<string, Rule>): {
    isValid: boolean;
    errors: ErrObj[];
};
//# sourceMappingURL=validation.d.ts.map