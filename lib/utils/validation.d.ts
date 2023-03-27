import { ErrObj } from '../entities/ValidationError';
export declare const allRules: {
    chain: {
        required: boolean;
        type: StringConstructor;
        length: {
            min: number;
            max: number;
        };
        matchParams: {
            regex: string;
            opt: string;
        };
    };
    fioAddress: {
        required: boolean;
        type: StringConstructor;
        length: {
            min: number;
            max: number;
        };
        matchParams: {
            regex: string;
            opt: string;
        };
    };
    tpid: {
        type: StringConstructor;
        length: {
            min: number;
            max: number;
        };
        matchParams: {
            regex: string;
            opt: string;
        };
    };
    fioDomain: {
        required: boolean;
        type: StringConstructor;
        length: {
            min: number;
            max: number;
        };
        matchParams: {
            regex: string;
            opt: string;
        };
    };
    fioPublicKey: {
        required: boolean;
        type: StringConstructor;
        length: {
            min: number;
            max: number;
        };
        matchParams: {
            regex: string;
        };
    };
    nativeBlockchainPublicAddress: {
        required: boolean;
        type: StringConstructor;
        length: {
            min: number;
            max: number;
        };
        matchParams: {
            regex: string;
        };
    };
};
export declare const validationRules: {
    addPublicAddressRules: {
        fioAddress: {
            required: boolean;
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
        tpid: {
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
    };
    cancelFundsRequestRules: {
        tpid: {
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
    };
    registerFioAddress: {
        fioAddress: {
            required: boolean;
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
        tpid: {
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
    };
    registerFioDomain: {
        fioDomain: {
            required: boolean;
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
        tpid: {
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
    };
    renewFioAddress: {
        fioAddress: {
            required: boolean;
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
        tpid: {
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
    };
    renewFioDomain: {
        fioDomain: {
            required: boolean;
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
        tpid: {
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
    };
    setFioDomainVisibility: {
        fioDomain: {
            required: boolean;
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
        tpid: {
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
    };
    newFundsRequest: {
        payerFioAddress: {
            required: boolean;
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
        payeeFioAddress: {
            required: boolean;
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
        tokenCode: {
            required: boolean;
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
        tpid: {
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
    };
    transferLockedTokensRequest: {
        tpid: {
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
    };
    rejectFunds: {
        tpid: {
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
    };
    recordObtData: {
        payerFioAddress: {
            required: boolean;
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
        payeeFioAddress: {
            required: boolean;
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
        tpid: {
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
        tokenCode: {
            required: boolean;
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
    };
    transferTokens: {
        tpid: {
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
    };
    getFee: {
        fioAddress: {
            required: boolean;
            type: StringConstructor;
            length: {
                min: number;
                max: number;
            };
            matchParams: {
                regex: string;
                opt: string;
            };
        };
    };
};
export declare function validate(data: any, rules: any): {
    isValid: boolean;
    errors: ErrObj[];
};
//# sourceMappingURL=validation.d.ts.map