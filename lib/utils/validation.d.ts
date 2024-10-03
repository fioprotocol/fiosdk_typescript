import { PropertyDefinition } from 'validate';
import { ErrObj } from '../entities';
export declare const allRules: {
    chain: {
        length: {
            min: number;
            max: number;
        };
        match: RegExp;
        required: true;
        type: StringConstructor;
    };
    fioAddress: {
        length: {
            min: number;
            max: number;
        };
        match: RegExp;
        required: true;
        type: StringConstructor;
    };
    fioDomain: {
        length: {
            min: number;
            max: number;
        };
        match: RegExp;
        required: true;
        type: StringConstructor;
    };
    fioName: {
        length: {
            min: number;
            max: number;
        };
        match: RegExp;
        required: true;
        type: StringConstructor;
    };
    fioPublicKey: {
        length: {
            min: number;
            max: number;
        };
        required: true;
        type: StringConstructor;
        use: {
            testFioPublicKey: (key: string) => any;
        };
    };
    nativeBlockchainPublicAddress: {
        length: {
            min: number;
            max: number;
        };
        required: true;
        type: StringConstructor;
        use: {
            testNativePublicKey: (key: string) => any;
        };
    };
    tpid: {
        length: {
            min: number;
            max: number;
        };
        match: RegExp;
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
            match: RegExp;
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            type: StringConstructor;
        };
    };
    cancelFundsRequestRules: {
        tpid: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            type: StringConstructor;
        };
    };
    getFee: {
        fioAddress: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
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
            match: RegExp;
            required: true;
            type: StringConstructor;
        };
        payerFioAddress: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            required: true;
            type: StringConstructor;
        };
        tokenCode: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            type: StringConstructor;
        };
    };
    recordObtData: {
        payeeFioAddress: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            required: true;
            type: StringConstructor;
        };
        payerFioAddress: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            required: true;
            type: StringConstructor;
        };
        tokenCode: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            type: StringConstructor;
        };
    };
    registerFioAddress: {
        fioAddress: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            type: StringConstructor;
        };
    };
    registerFioDomain: {
        fioDomain: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            type: StringConstructor;
        };
    };
    registerFioDomainAddress: {
        fioAddress: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            type: StringConstructor;
        };
    };
    rejectFunds: {
        tpid: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            type: StringConstructor;
        };
    };
    renewFioAddress: {
        fioAddress: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            type: StringConstructor;
        };
    };
    renewFioDomain: {
        fioDomain: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            type: StringConstructor;
        };
    };
    setFioDomainVisibility: {
        fioDomain: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            required: true;
            type: StringConstructor;
        };
        tpid: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            type: StringConstructor;
        };
    };
    transferLockedTokensRequest: {
        tpid: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            type: StringConstructor;
        };
    };
    transferTokens: {
        tpid: {
            length: {
                min: number;
                max: number;
            };
            match: RegExp;
            type: StringConstructor;
        };
    };
};
export declare function validate(data: any, rules: Record<string, PropertyDefinition>): {
    isValid: boolean;
    errors: ErrObj[];
};
//# sourceMappingURL=validation.d.ts.map