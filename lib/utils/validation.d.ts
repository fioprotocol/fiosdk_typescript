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
        required: false;
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
            required: false;
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
            required: false;
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
            required: false;
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
            required: false;
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
            required: false;
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
            required: false;
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
            required: false;
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
            required: false;
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
            required: false;
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
            required: false;
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
            required: false;
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
            required: false;
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
            required: false;
        };
    };
};
export declare function validate(data: any, rules: Record<string, PropertyDefinition>): {
    isValid: boolean;
    errors: ErrObj[];
};
//# sourceMappingURL=validation.d.ts.map