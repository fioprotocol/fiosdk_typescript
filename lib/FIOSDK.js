"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIOSDK = exports.GenericAction = exports.fioConstants = void 0;
const fiojs_1 = require("@fioprotocol/fiojs");
const big_js_1 = __importDefault(require("big.js"));
const entities_1 = require("./entities");
const queries = __importStar(require("./transactions/queries"));
const Transactions_1 = require("./transactions/Transactions");
const requests = __importStar(require("./transactions/signed"));
const SignedTransaction_1 = require("./transactions/signed/SignedTransaction");
const fioConstants = __importStar(require("./utils/constants"));
exports.fioConstants = fioConstants;
const utils_1 = require("./utils/utils");
const validation_1 = require("./utils/validation");
__exportStar(require("./utils/validation"), exports);
__exportStar(require("./entities"), exports);
var GenericAction;
(function (GenericAction) {
    GenericAction["getFioPublicKey"] = "getFioPublicKey";
    GenericAction["getAccount"] = "getAccount";
    GenericAction["registerFioDomainAddress"] = "registerFioDomainAddress";
    GenericAction["registerFioAddress"] = "registerFioAddress";
    GenericAction["registerOwnerFioAddress"] = "registerOwnerFioAddress";
    GenericAction["transferLockedTokens"] = "transferLockedTokens";
    GenericAction["registerFioDomain"] = "registerFioDomain";
    GenericAction["registerOwnerFioDomain"] = "registerOwnerFioDomain";
    GenericAction["renewFioDomain"] = "renewFioDomain";
    GenericAction["renewFioAddress"] = "renewFioAddress";
    GenericAction["burnFioAddress"] = "burnFioAddress";
    GenericAction["transferFioAddress"] = "transferFioAddress";
    GenericAction["transferFioDomain"] = "transferFioDomain";
    GenericAction["addBundledTransactions"] = "addBundledTransactions";
    GenericAction["addPublicAddress"] = "addPublicAddress";
    GenericAction["addPublicAddresses"] = "addPublicAddresses";
    GenericAction["removePublicAddresses"] = "removePublicAddresses";
    GenericAction["getLocks"] = "getLocks";
    GenericAction["cancelFundsRequest"] = "cancelFundsRequest";
    GenericAction["removeAllPublicAddresses"] = "removeAllPublicAddresses";
    GenericAction["setFioDomainVisibility"] = "setFioDomainVisibility";
    GenericAction["recordObtData"] = "recordObtData";
    GenericAction["getObtData"] = "getObtData";
    GenericAction["getGranteePermissions"] = "getGranteePermissions";
    GenericAction["getGrantorPermissions"] = "getGrantorPermissions";
    GenericAction["getObjectPermissions"] = "getObjectPermissions";
    GenericAction["rejectFundsRequest"] = "rejectFundsRequest";
    GenericAction["requestFunds"] = "requestFunds";
    GenericAction["isAvailable"] = "isAvailable";
    GenericAction["getFioBalance"] = "getFioBalance";
    GenericAction["getFioNames"] = "getFioNames";
    GenericAction["getFioDomains"] = "getFioDomains";
    GenericAction["getFioAddresses"] = "getFioAddresses";
    GenericAction["getPendingFioRequests"] = "getPendingFioRequests";
    GenericAction["getReceivedFioRequests"] = "getReceivedFioRequests";
    GenericAction["getCancelledFioRequests"] = "getCancelledFioRequests";
    GenericAction["getSentFioRequests"] = "getSentFioRequests";
    GenericAction["getPublicAddress"] = "getPublicAddress";
    GenericAction["getFioPublicAddress"] = "getFioPublicAddress";
    GenericAction["getPublicAddresses"] = "getPublicAddresses";
    GenericAction["getNfts"] = "getNfts";
    GenericAction["transferTokens"] = "transferTokens";
    GenericAction["stakeFioTokens"] = "stakeFioTokens";
    GenericAction["unStakeFioTokens"] = "unStakeFioTokens";
    GenericAction["getOracleFees"] = "getOracleFees";
    GenericAction["getAbi"] = "getAbi";
    GenericAction["getFee"] = "getFee";
    GenericAction["getFeeForRecordObtData"] = "getFeeForRecordObtData";
    GenericAction["getFeeForNewFundsRequest"] = "getFeeForNewFundsRequest";
    GenericAction["getFeeForRejectFundsRequest"] = "getFeeForRejectFundsRequest";
    GenericAction["getFeeForBurnFioAddress"] = "getFeeForBurnFioAddress";
    GenericAction["getFeeForTransferFioAddress"] = "getFeeForTransferFioAddress";
    GenericAction["getFeeForTransferFioDomain"] = "getFeeForTransferFioDomain";
    GenericAction["getFeeForAddBundledTransactions"] = "getFeeForAddBundledTransactions";
    GenericAction["getFeeForAddPublicAddress"] = "getFeeForAddPublicAddress";
    GenericAction["getFeeForCancelFundsRequest"] = "getFeeForCancelFundsRequest";
    GenericAction["getFeeForRemovePublicAddresses"] = "getFeeForRemovePublicAddresses";
    GenericAction["getFeeForRemoveAllPublicAddresses"] = "getFeeForRemoveAllPublicAddresses";
    GenericAction["getFeeForTransferLockedTokens"] = "getFeeForTransferLockedTokens";
    GenericAction["getMultiplier"] = "getMultiplier";
    GenericAction["pushTransaction"] = "pushTransaction";
    GenericAction["getAccountPubKey"] = "getAccountPubKey";
    GenericAction["getEncryptKey"] = "getEncryptKey";
})(GenericAction || (exports.GenericAction = GenericAction = {}));
class FIOSDK {
    /**
     * @ignore
     * Needed for testing abi
     */
    static setCustomRawAbiAccountName(customRawAbiAccountName) {
        if (customRawAbiAccountName) {
            FIOSDK.customRawAbiAccountName = [customRawAbiAccountName];
        }
        else {
            FIOSDK.customRawAbiAccountName = null;
        }
    }
    /**
     * @ignore
     */
    static createPrivateKey(entropy) {
        return __awaiter(this, void 0, void 0, function* () {
            const bip39 = require('bip39');
            const mnemonic = bip39.entropyToMnemonic(entropy);
            return yield FIOSDK.createPrivateKeyMnemonic(mnemonic);
        });
    }
    /**
     * Create a FIO private key.
     *
     * @param mnemonic mnemonic used to generate a random unique private key.
     * @example real flame win provide layer trigger soda erode upset rate beef wrist fame design merit
     *
     * @returns New FIO private key
     */
    static createPrivateKeyMnemonic(mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            const hdkey = require('hdkey');
            const wif = require('wif');
            const bip39 = require('bip39');
            const seedBytes = yield bip39.mnemonicToSeed(mnemonic);
            const seed = yield seedBytes.toString('hex');
            const master = hdkey.fromMasterSeed(new Buffer(seed, 'hex'));
            const node = master.derive('m/44\'/235\'/0\'/0/0');
            const fioKey = wif.encode(128, node._privateKey, false);
            return { fioKey, mnemonic };
        });
    }
    /**
     * Create a FIO public key.
     *
     * @param fioPrivateKey FIO private key.
     *
     * @returns FIO public key derived from the FIO private key.
     */
    static derivedPublicKey(fioPrivateKey) {
        const publicKey = fiojs_1.Ecc.privateToPublic(fioPrivateKey);
        return { publicKey };
    }
    /**
     * hash a pub key
     *
     * @param fioPublicKey FIO private key.
     *
     * @returns FIO account derived from pub key.
     */
    static accountHash(fioPublicKey) {
        const accountnm = fiojs_1.Fio.accountHash(fioPublicKey);
        return { accountnm };
    }
    /**
     * @deprecated use {@link FIOSDK#validateChainCode}
     * Is the Chain Code Valid?
     *
     * @param chainCode
     *
     * @returns Chain Code is Valid
     */
    static isChainCodeValid(chainCode) {
        const validation = (0, validation_1.validate)({ chainCode }, { chainCode: validation_1.allRules.chain });
        if (!validation.isValid) {
            throw new entities_1.ValidationError(validation.errors, `Validation error`);
        }
        return validation.isValid;
    }
    /**
     * @deprecated use {@link FIOSDK#validateTokenCode}
     * Is the Token Code Valid?
     *
     * @param tokenCode
     *
     * @returns Token Code is Valid
     */
    static isTokenCodeValid(tokenCode) {
        const validation = (0, validation_1.validate)({ tokenCode }, { tokenCode: validation_1.allRules.chain });
        if (!validation.isValid) {
            throw new entities_1.ValidationError(validation.errors);
        }
        return validation.isValid;
    }
    /**
     * @deprecated use {@link FIOSDK#validateFioAddress}
     * Is the FIO Address Valid?
     *
     * @param fioAddress
     *
     * @returns Fio Address is Valid
     */
    static isFioAddressValid(fioAddress) {
        const validation = (0, validation_1.validate)({ fioAddress }, { fioAddress: validation_1.allRules.fioAddress });
        if (!validation.isValid) {
            throw new entities_1.ValidationError(validation.errors);
        }
        return validation.isValid;
    }
    /**
     * @deprecated use {@link FIOSDK#validateFioDomain}
     * Is the FIO Domain Valid?
     *
     * @param fioDomain
     *
     * @returns FIO Domain is Valid
     */
    static isFioDomainValid(fioDomain) {
        const validation = (0, validation_1.validate)({ fioDomain }, { fioDomain: validation_1.allRules.fioDomain });
        if (!validation.isValid) {
            throw new entities_1.ValidationError(validation.errors);
        }
        return validation.isValid;
    }
    /**
     * @deprecated use {@link FIOSDK#validateFioPublicKey}
     * Is the FIO Public Key Valid?
     *
     * @param fioPublicKey
     *
     * @returns FIO Public Key is Valid
     */
    static isFioPublicKeyValid(fioPublicKey) {
        const validation = (0, validation_1.validate)({ fioPublicKey }, { fioPublicKey: validation_1.allRules.fioPublicKey });
        if (!validation.isValid) {
            throw new entities_1.ValidationError(validation.errors);
        }
        return validation.isValid;
    }
    /**
     * @deprecated use {@link FIOSDK#validatePublicAddress}
     * Is the Public Address Valid?
     *
     * @param publicAddress
     *
     * @returns Public Address is Valid
     */
    static isPublicAddressValid(publicAddress) {
        const validation = (0, validation_1.validate)({ publicAddress }, { publicAddress: validation_1.allRules.nativeBlockchainPublicAddress });
        if (!validation.isValid) {
            throw new entities_1.ValidationError(validation.errors);
        }
        return validation.isValid;
    }
    /**
     * Convert a FIO Token Amount to FIO SUFs
     *
     * @param amount
     *
     * 2.568 FIO should be 2568000000 SUFs
     *
     * @returns FIO SUFs
     */
    static amountToSUF(amount) {
        // get integer part
        const floor = Math.floor(amount);
        const tempResult = floor * this.SUFUnit;
        // get remainder
        const remainder = Number((amount % 1).toFixed(9));
        const remainderResult = remainder * (this.SUFUnit);
        const floorRemainder = Math.floor(remainderResult);
        // add integer and remainder
        return tempResult + floorRemainder;
    }
    /**
     * Convert FIO SUFs to a FIO Token amount
     *
     * @param suf {string | number}
     *
     * @returns FIO Token amount
     */
    static SUFToAmount(suf) {
        return (typeof suf === 'number' ? suf : parseInt(suf, 10)) / this.SUFUnit;
    }
    /**
     * Convert a FIO Token Amount to FIO SUFs
     *
     * @param amount
     *
     * 2.568 FIO should be 2568000000 SUFs
     *
     * @returns {string} FIO SUFs
     */
    static amountToSUFString(amount) {
        const floor = new big_js_1.default(amount).round(0, 0).toString();
        const tempResult = new big_js_1.default(floor).mul(this.SUFUnit).toString();
        // get remainder
        const remainder = new big_js_1.default(amount)
            .mod(1)
            .round(9, 2)
            .toString();
        const remainderResult = new big_js_1.default(remainder).mul(this.SUFUnit).toString();
        const floorRemainder = new big_js_1.default(remainderResult).round(0, 0).toString();
        // add integer and remainder
        return new big_js_1.default(tempResult).add(floorRemainder).toString();
    }
    /**
     * Convert FIO SUFs to a FIO Token amount
     *
     * @param suf {string | number}
     *
     * @returns {string} FIO Token amount
     */
    static SUFToAmountString(suf) {
        return new big_js_1.default(suf).div(this.SUFUnit).toString();
    }
    /**
     * Set stored raw abi missing warnings
     */
    static setRawAbiMissingWarnings(rawAbiName, fioSdkInstance) {
        fioSdkInstance.rawAbiMissingWarnings.push(rawAbiName);
    }
    static get abiMap() {
        return Transactions_1.Transactions.abiMap;
    }
    get transactions() {
        const request = new Transactions_1.Transactions(this.config);
        return {
            createRawTransaction: request.createRawTransaction.bind(request),
            getActor: request.getActor.bind(request),
            getBlock: request.getBlock.bind(request),
            getChainDataForTx: request.getChainDataForTx.bind(request),
            getChainInfo: request.getChainInfo.bind(request),
            getCipherContent: utils_1.getCipherContent,
            getUnCipherContent: utils_1.getUnCipherContent,
            serialize: request.serialize.bind(request),
            deserialize: request.deserialize.bind(request),
        };
    }
    constructor() {
        /**
         * @ignore
         */
        this.proxyHandle = {
            // We save reference to our class inside the object
            main: this,
            /**
             * To apply will be fired each time the function is called
             * @param  target Called function
             * @param  scope  Scope from where function was called
             * @param  args   Arguments passed to function
             * @return        Results of the function
             */
            apply(target, scope, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Remember that you have to exclude methods which you are going to use
                    // inside here to avoid “too much recursion” error
                    const setAbi = (accountName) => __awaiter(this, void 0, void 0, function* () {
                        if (!Transactions_1.Transactions.abiMap.get(accountName)) {
                            const newAbi = yield this.main.getAbi({ accountName });
                            if (newAbi && newAbi.account_name) {
                                Transactions_1.Transactions.abiMap.set(newAbi.account_name, newAbi);
                            }
                        }
                    });
                    let rawAbiAccountNameList = [];
                    if (FIOSDK.customRawAbiAccountName) {
                        rawAbiAccountNameList = [...Object.values(entities_1.Account), ...FIOSDK.customRawAbiAccountName];
                    }
                    else {
                        rawAbiAccountNameList = Object.values(entities_1.Account);
                    }
                    const setAbiPromises = rawAbiAccountNameList.map((accountName) => setAbi(accountName));
                    yield Promise.allSettled(setAbiPromises).then((results) => results.forEach((result) => {
                        var _a, _b, _c;
                        if (result.status === 'rejected') {
                            let error = '';
                            const reason = result.reason;
                            const errorObj = reason.json || reason.errors && reason.errors[0].json;
                            if (errorObj) {
                                error = (_b = (_a = errorObj.error) === null || _a === void 0 ? void 0 : _a.details[0]) === null || _b === void 0 ? void 0 : _b.message;
                            }
                            if (!error) {
                                error = reason.message;
                            }
                            if (error.includes(fioConstants.missingAbiError)) {
                                const abiAccountName = reason.requestParams
                                    && reason.requestParams.body
                                    && reason.requestParams.body
                                        .replace('{', '')
                                        .replace('}', '')
                                        .split(':')[1]
                                        .replace('\"', '')
                                        .replace('\"', '');
                                if (!((_c = this.main.rawAbiMissingWarnings) === null || _c === void 0 ? void 0 : _c.includes(abiAccountName))
                                    || (FIOSDK.customRawAbiAccountName
                                        && FIOSDK.customRawAbiAccountName.includes(abiAccountName))) {
                                    // tslint:disable-next-line:no-console
                                    console.warn('\x1b[33m', 'FIO_SDK ABI WARNING:', error);
                                    FIOSDK.setRawAbiMissingWarnings(abiAccountName, this.main);
                                }
                            }
                            else {
                                throw new Error(`FIO_SDK ABI Error: ${result.reason}`);
                            }
                        }
                    }));
                    // Here we bind method with our class by accessing reference to instance
                    return target.bind(this.main)(...args);
                });
            },
        };
        const { privateKey = '', publicKey = '', apiUrls, fetchJson, registerMockUrl = '', technologyProviderId = '', returnPreparedTrx = false, logger, } = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['privateKey', 'publicKey', 'apiUrls', 'fetchJson', 'registerMockUrl', 'technologyProviderId', 'returnPreparedTrx', 'throwValidationErrors', 'logger'],
        });
        this.config = {
            baseUrls: Array.isArray(apiUrls) ? apiUrls : [apiUrls],
            fetchJson,
            fioProvider: fiojs_1.Fio,
            logger,
        };
        this.registerMockUrl = registerMockUrl;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        this.technologyProviderId = technologyProviderId;
        this.returnPreparedTrx = returnPreparedTrx;
        this.rawAbiMissingWarnings = [];
        const methods = Object.getOwnPropertyNames(FIOSDK.prototype).filter((name) => !fioConstants.classMethodsToExcludeFromProxy.includes(name));
        // Replace all methods with Proxy methods
        // Find and remove constructor as we don't need Proxy on it
        methods.forEach((methodName) => {
            this[methodName] = new Proxy(this[methodName], this.proxyHandle);
        });
    }
    /**
     * Is the Chain Code Valid?
     *
     * @param chainCode
     *
     * @returns Chain Code is Valid
     */
    validateChainCode(chainCode) {
        var _a, _b;
        const validation = (0, validation_1.validate)({ chainCode }, { chainCode: validation_1.allRules.chain });
        if (!validation.isValid) {
            (_b = (_a = this.config).logger) === null || _b === void 0 ? void 0 : _b.call(_a, {
                context: {
                    errors: validation.errors,
                    name: 'validateChainCode',
                },
                type: 'validation',
            });
        }
        return validation.isValid;
    }
    /**
     * Is the Token Code Valid?
     *
     * @param tokenCode
     *
     * @returns Token Code is Valid
     */
    validateTokenCode(tokenCode) {
        var _a, _b;
        const validation = (0, validation_1.validate)({ tokenCode }, { tokenCode: validation_1.allRules.chain });
        if (!validation.isValid) {
            (_b = (_a = this.config).logger) === null || _b === void 0 ? void 0 : _b.call(_a, {
                context: {
                    errors: validation.errors,
                    name: 'validateTokenCode',
                },
                type: 'validation',
            });
        }
        return validation.isValid;
    }
    /**
     * Is the FIO Address Valid?
     *
     * @param fioAddress
     *
     * @returns Fio Address is Valid
     */
    validateFioAddress(fioAddress) {
        var _a, _b;
        const validation = (0, validation_1.validate)({ fioAddress }, { fioAddress: validation_1.allRules.fioAddress });
        if (!validation.isValid) {
            (_b = (_a = this.config).logger) === null || _b === void 0 ? void 0 : _b.call(_a, {
                context: {
                    errors: validation.errors,
                    name: 'validateFioAddress',
                },
                type: 'validation',
            });
        }
        return validation.isValid;
    }
    /**
     * Is the FIO Domain Valid?
     *
     * @param fioDomain
     *
     * @returns FIO Domain is Valid
     */
    validateFioDomain(fioDomain) {
        var _a, _b;
        const validation = (0, validation_1.validate)({ fioDomain }, { fioDomain: validation_1.allRules.fioDomain });
        if (!validation.isValid) {
            (_b = (_a = this.config).logger) === null || _b === void 0 ? void 0 : _b.call(_a, {
                context: {
                    errors: validation.errors,
                    name: 'validateFioDomain',
                },
                type: 'validation',
            });
        }
        return validation.isValid;
    }
    /**
     * Is the FIO Public Key Valid?
     *
     * @param fioPublicKey
     *
     * @returns FIO Public Key is Valid
     */
    validateFioPublicKey(fioPublicKey) {
        var _a, _b;
        const validation = (0, validation_1.validate)({ fioPublicKey }, { fioPublicKey: validation_1.allRules.fioPublicKey });
        if (!validation.isValid) {
            (_b = (_a = this.config).logger) === null || _b === void 0 ? void 0 : _b.call(_a, {
                context: {
                    errors: validation.errors,
                    name: 'validateFioPublicKey',
                },
                type: 'validation',
            });
        }
        return validation.isValid;
    }
    /**
     * Is the Public Address Valid?
     *
     * @param publicAddress
     *
     * @returns Public Address is Valid
     */
    validatePublicAddress(publicAddress) {
        var _a, _b;
        const validation = (0, validation_1.validate)({ publicAddress }, { publicAddress: validation_1.allRules.nativeBlockchainPublicAddress });
        if (!validation.isValid) {
            (_b = (_a = this.config).logger) === null || _b === void 0 ? void 0 : _b.call(_a, {
                context: {
                    errors: validation.errors,
                    name: 'validatePublicAddress',
                },
                type: 'validation',
            });
        }
        return validation.isValid;
    }
    /**
     * Retrieves the FIO public key assigned to the FIOSDK instance.
     */
    getFioPublicKey() {
        return this.publicKey;
    }
    /**
     * Returns technologyProviderId or default
     */
    getTechnologyProviderId(technologyProviderId) {
        return technologyProviderId !== undefined && technologyProviderId !== null
            ? technologyProviderId
            : this.technologyProviderId;
    }
    /**
     * Set returnPreparedTrx
     */
    setSignedTrxReturnOption(returnPreparedTrx) {
        this.returnPreparedTrx = returnPreparedTrx;
    }
    /**
     * Set transactions baseUrls
     */
    setApiUrls(apiUrls) {
        this.config.baseUrls = apiUrls;
    }
    /**
     * Execute prepared transaction.
     *
     * @param endPoint endpoint.
     * @param preparedTrx
     */
    executePreparedTrx(endPoint, preparedTrx) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield new Transactions_1.Transactions(this.config).multicastServers({
                body: JSON.stringify(preparedTrx),
                endpoint: `chain/${endPoint}`,
            });
            return SignedTransaction_1.SignedTransaction.prepareResponse(response, true);
        });
    }
    registerFioAddress() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress', 'maxFee', 'technologyProviderId', 'expirationOffset'],
        });
        const registerFioAddress = new requests.RegisterFioAddress(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return registerFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx, args.expirationOffset);
    }
    registerOwnerFioAddress() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress', 'ownerPublicKey', 'maxFee', 'technologyProviderId', 'expirationOffset'],
        });
        const registerFioAddress = new requests.RegisterFioAddress(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return registerFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx, args.expirationOffset);
    }
    /**
     * Registers a FIO Address and FIO domain on behalf of the owner FIO Public key parameter.
     * Owner FIO Public key owns the FIO address
     *
     * @param options.fioAddress FIO Address to register.
     * @param options.isPublic true - allows anyone to register FIO Address,
     * false - only owner of domain can register FIO Address.
     * @param options.ownerPublicKey Owner FIO Public Key.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param options.expirationOffset Expiration time offset for this transaction in seconds.
     * Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
     */
    registerFioDomainAddress(options) {
        const args = (0, utils_1.cleanupObject)(options);
        const registerFioDomainAddress = new requests.RegisterFioDomainAddress(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return registerFioDomainAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx, args.expirationOffset);
    }
    registerFioDomain() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioDomain', 'maxFee', 'technologyProviderId', 'expirationOffset'],
        });
        const registerFioDomain = new requests.RegisterFioDomain(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return registerFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx, args.expirationOffset);
    }
    registerOwnerFioDomain() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioDomain', 'ownerPublicKey', 'maxFee', 'technologyProviderId', 'expirationOffset'],
        });
        const registerFioDomain = new requests.RegisterFioDomain(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return registerFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx, args.expirationOffset);
    }
    burnFioAddress() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress', 'maxFee', 'technologyProviderId'],
        });
        const burnFioAddress = new requests.BurnFioAddress(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return burnFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    transferFioDomain() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioDomain', 'newOwnerKey', 'maxFee', 'technologyProviderId'],
        });
        const transferFioDomain = new requests.TransferFioDomain(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return transferFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    transferFioAddress() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress', 'newOwnerKey', 'maxFee', 'technologyProviderId'],
        });
        const transferFioAddress = new requests.TransferFioAddress(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return transferFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    addBundledTransactions() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress', 'bundleSets', 'maxFee', 'technologyProviderId', 'expirationOffset'],
        });
        const addBundledTransactions = new requests.AddBundledTransactions(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return addBundledTransactions.execute(this.privateKey, this.publicKey, this.returnPreparedTrx, args.expirationOffset);
    }
    renewFioAddress() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress', 'maxFee', 'technologyProviderId'],
        });
        const renewFioAddress = new requests.RenewFioAddress(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return renewFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    renewFioDomain() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioDomain', 'maxFee', 'technologyProviderId', 'expirationOffset'],
        });
        const renewFioDomain = new requests.RenewFioDomain(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return renewFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx, args.expirationOffset);
    }
    addPublicAddress() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress', 'chainCode', 'tokenCode', 'publicAddress', 'maxFee', 'technologyProviderId'],
        });
        const addPublicAddress = new requests.AddPublicAddresses(this.config, Object.assign(Object.assign({}, args), { publicAddresses: [{
                    chain_code: args.chainCode,
                    public_address: args.publicAddress,
                    token_code: args.tokenCode,
                }], technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return addPublicAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    cancelFundsRequest() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioRequestId', 'maxFee', 'technologyProviderId'],
        });
        const cancelFundsRequest = new requests.CancelFundsRequest(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return cancelFundsRequest.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    removePublicAddresses() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress', 'publicAddresses', 'maxFee', 'technologyProviderId'],
        });
        const removePublicAddresses = new requests.RemovePublicAddresses(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return removePublicAddresses.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    transferLockedTokens() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['payeePublicKey', 'canVote', 'periods', 'amount', 'maxFee', 'technologyProviderId'],
        });
        const transferLockedTokens = new requests.TransferLockedTokens(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return transferLockedTokens.execute(this.privateKey, this.publicKey);
    }
    removeAllPublicAddresses() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress', 'maxFee', 'technologyProviderId'],
        });
        const removeAllPublicAddresses = new requests.RemoveAllPublicAddresses(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return removeAllPublicAddresses.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    addPublicAddresses() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress', 'publicAddresses', 'maxFee', 'technologyProviderId'],
        });
        const addPublicAddress = new requests.AddPublicAddresses(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return addPublicAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    setFioDomainVisibility() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioDomain', 'isPublic', 'maxFee', 'technologyProviderId'],
        });
        const SetFioDomainVisibility = new requests.SetFioDomainVisibility(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return SetFioDomainVisibility.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    /**
     * Records information on the FIO blockchain about a transaction that occurred on other blockchain,
     * i.e. 1 BTC was sent on Bitcoin Blockchain, and both
     * sender and receiver have FIO Addresses. OBT stands for Other Blockchain Transaction
     *
     * @param options.fioRequestId ID of funds request, if this Record Send transaction
     * is in response to a previously received funds request. Send empty if no FIO Request ID
     * @param options.payerFioAddress FIO Address of the payer. This address initiated payment.
     * @param options.payeeFioAddress FIO Address of the payee. This address is receiving payment.
     * @param options.payerTokenPublicAddress Public address on other blockchain of user sending funds.
     * @param options.payeeTokenPublicAddress Public address on other blockchain of user receiving funds.
     * @param options.amount Amount sent.
     * @param options.chainCode Blockchain code for blockchain hosting this token.
     * @param options.tokenCode Code of the token represented in Amount requested, i.e. BTC.
     * @param options.status Status of this OBT. Allowed statuses are: sent_to_blockchain.
     * @param options.obtId Other Blockchain Transaction ID (OBT ID), i.e. Bitcoin transaction ID.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param options.payeeFioPublicKey Public address on other blockchain of user receiving funds.
     * @param options.memo
     * @param options.hash
     * @param options.offlineUrl
     * @param options.encryptPrivateKey Encrypt Private Key for encrypt content. If missing uses this.privateKey.
     */
    recordObtData(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = (0, utils_1.cleanupObject)(options);
            const payeeEncryptKey = yield this.getEncryptKey({
                fioAddress: args.payeeFioAddress,
            });
            const recordObtData = new requests.RecordObtData(this.config, Object.assign(Object.assign({}, args), { payeeFioPublicKey: (payeeEncryptKey === null || payeeEncryptKey === void 0 ? void 0 : payeeEncryptKey.encrypt_public_key) || args.payeeFioPublicKey, technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
            return recordObtData.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
        });
    }
    /**
     * Retrieves OBT metadata data stored using record send.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.tokenCode Code of the token to filter results
     * @param options.includeEncrypted Set to true if you want to include not encrypted data in return.
     */
    getObtData(options) {
        const args = (0, utils_1.cleanupObject)(options);
        const getObtDataRequest = new queries.GetObtData(this.config, Object.assign(Object.assign({}, args), { fioPublicKey: this.publicKey, getEncryptKey: this.getEncryptKey }));
        return getObtDataRequest.execute(this.publicKey, this.privateKey);
    }
    getGranteePermissions() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['granteeAccount', 'limit', 'offset'],
        });
        const getGranteePermissions = new queries.GetGranteePermissions(this.config, args);
        return getGranteePermissions.execute(this.publicKey, this.privateKey);
    }
    getGrantorPermissions() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['grantorAccount', 'limit', 'offset'],
        });
        const getGrantorPermissions = new queries.GetGrantorPermissions(this.config, args);
        return getGrantorPermissions.execute(this.publicKey, this.privateKey);
    }
    getObjectPermissions() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['permissionName', 'objectName', 'limit', 'offset'],
        });
        const getObjectPermissions = new queries.GetObjectPermissions(this.config, args);
        return getObjectPermissions.execute(this.publicKey, this.privateKey);
    }
    rejectFundsRequest() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioRequestId', 'maxFee', 'technologyProviderId'],
        });
        const rejectFundsRequest = new requests.RejectFundsRequest(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return rejectFundsRequest.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    /**
     * Create a new funds request on the FIO chain.
     *
     * @param options.amount Amount requested.
     * @param options.chainCode Blockchain code for blockchain hosting this token.
     * @param options.encryptPrivateKey Encrypt Private Key for encrypt content. If missing uses this.privateKey.
     * @param options.hash
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by [getFee] for correct value.
     * @param options.memo
     * @param options.offlineUrl
     * @param options.payeeFioAddress FIO Address of the payee.
     * This address is sending the request and will receive payment.
     * @param options.payeeTokenPublicAddress Payee's public address where they want funds sent.
     * @param options.payerFioAddress FIO Address of the payer.
     * This address will receive the request and will initiate payment.
     * @param options.payerFioPublicKey Public address on other blockchain of user sending funds.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param options.tokenCode Code of the token represented in amount requested.
     */
    requestFunds(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = (0, utils_1.cleanupObject)(options);
            const payerEncryptKey = yield this.getEncryptKey({
                fioAddress: args.payerFioAddress,
            });
            const requestNewFunds = new requests.RequestNewFunds(this.config, Object.assign(Object.assign({}, args), { payerFioPublicKey: (payerEncryptKey === null || payerEncryptKey === void 0 ? void 0 : payerEncryptKey.encrypt_public_key) || args.payerFioPublicKey, technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
            return requestNewFunds.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
        });
    }
    getLocks() {
        const args = (0, utils_1.resolveOptions)({ keys: ['fioPublicKey'], arguments: Array.from(arguments) });
        const getLocks = new queries.GetLocks(this.config, args);
        return getLocks.execute(this.publicKey);
    }
    getAccount() {
        const args = (0, utils_1.resolveOptions)({ keys: ['actor'], arguments: Array.from(arguments) });
        const getAccount = new queries.GetAccount(this.config, args);
        return getAccount.execute(this.publicKey);
    }
    isAvailable() {
        const args = (0, utils_1.resolveOptions)({ keys: ['fioName'], arguments: Array.from(arguments) });
        const availabilityCheck = new queries.AvailabilityCheckQuery(this.config, args);
        return availabilityCheck.execute(this.publicKey);
    }
    getFioBalance() {
        const args = (0, utils_1.resolveOptions)({ keys: ['fioPublicKey'], arguments: Array.from(arguments) });
        const getFioBalance = new queries.GetFioBalance(this.config, args);
        return getFioBalance.execute(this.publicKey);
    }
    getFioNames() {
        const args = (0, utils_1.resolveOptions)({ keys: ['fioPublicKey'], arguments: Array.from(arguments) });
        const getNames = new queries.GetNames(this.config, args);
        return getNames.execute(this.publicKey);
    }
    getFioAddresses() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioPublicKey', 'limit', 'offset'],
        });
        const getNames = new queries.GetAddresses(this.config, args);
        return getNames.execute(this.publicKey);
    }
    getFioDomains() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioPublicKey', 'limit', 'offset'],
        });
        const getNames = new queries.GetDomains(this.config, args);
        return getNames.execute(this.publicKey);
    }
    /**
     * Polls for any pending requests sent to public key associated with the FIO SDK instance.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.encryptKeys FIO Public Keys for decrypt content data.
     */
    getPendingFioRequests(options) {
        const args = (0, utils_1.cleanupObject)(options);
        const pendingFioRequests = new queries.PendingFioRequests(this.config, Object.assign(Object.assign({}, args), { fioPublicKey: this.publicKey, getEncryptKey: this.getEncryptKey.bind(this) }));
        return pendingFioRequests.execute(this.publicKey, this.privateKey);
    }
    /**
     * Polls for any received requests sent to public key associated with the FIO SDK instance.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.includeEncrypted Set to true if you want to include not encrypted data in return.
     * @param options.encryptKeys FIO Public Keys for decrypt content data.
     */
    getReceivedFioRequests(options) {
        const args = (0, utils_1.cleanupObject)(options);
        const receivedFioRequests = new queries.ReceivedFioRequests(this.config, Object.assign(Object.assign({}, args), { fioPublicKey: this.publicKey, getEncryptKey: this.getEncryptKey.bind(this) }));
        return receivedFioRequests.execute(this.publicKey, this.privateKey);
    }
    /**
     * Polls for any sent requests sent by public key associated with the FIO SDK instance.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.includeEncrypted Set to true if you want to include not encrypted data in return.
     * @param options.encryptKeys FIO Public Keys for decrypt content data.
     */
    getSentFioRequests(options) {
        const args = (0, utils_1.cleanupObject)(options);
        const sentFioRequest = new queries.SentFioRequests(this.config, Object.assign(Object.assign({}, args), { fioPublicKey: this.publicKey, getEncryptKey: this.getEncryptKey.bind(this) }));
        return sentFioRequest.execute(this.publicKey, this.privateKey);
    }
    /**
     * Polls for any cancelled requests sent by public key associated with the FIO SDK instance.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.encryptKeys FIO Public Keys for decrypt content data.
     */
    getCancelledFioRequests(options) {
        const args = (0, utils_1.cleanupObject)(options);
        const cancelledFioRequest = new queries.CancelledFioRequestsQuery(this.config, Object.assign(Object.assign({}, args), { fioPublicKey: this.publicKey, getEncryptKey: this.getEncryptKey.bind(this) }));
        return cancelledFioRequest.execute(this.publicKey, this.privateKey);
    }
    getPublicAddress() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress', 'chainCode', 'tokenCode'],
        });
        const publicAddressLookUp = new queries.GetPublicAddress(this.config, args);
        return publicAddressLookUp.execute(this.publicKey);
    }
    getPublicAddresses() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress', 'limit', 'offset'],
        });
        const publicAddressesLookUp = new queries.GetPublicAddresses(this.config, args);
        return publicAddressesLookUp.execute(this.publicKey);
    }
    getFioPublicAddress() {
        const { fioAddress } = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress'],
        });
        return this.getPublicAddress({ fioAddress, chainCode: 'FIO', tokenCode: 'FIO' });
    }
    getNfts() {
        const { fioAddress, chainCode, contractAddress, tokenId, hash, limit, offset, } = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['$base', 'limit', 'offset'],
        });
        let nftsLookUp;
        if (fioAddress !== undefined && fioAddress !== '') {
            nftsLookUp = new queries.GetNftsByFioAddress(this.config, {
                fioAddress,
                limit,
                offset,
            });
        }
        if (chainCode !== undefined && chainCode !== '' && contractAddress !== undefined && contractAddress !== '') {
            nftsLookUp = new queries.GetNftsByContract(this.config, {
                chainCode,
                contractAddress,
                limit,
                offset,
                tokenId,
            });
        }
        if (hash !== undefined && hash !== '') {
            nftsLookUp = new queries.GetNftsByHash(this.config, {
                hash,
                limit,
                offset,
            });
        }
        if (nftsLookUp == null) {
            throw new Error('At least one of these options should be set: fioAddress, chainCode/contractAddress, hash');
        }
        return nftsLookUp.execute(this.publicKey);
    }
    transferTokens() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['payeeFioPublicKey', 'amount', 'maxFee', 'technologyProviderId'],
        });
        const transferTokens = new requests.TransferTokens(this.config, Object.assign(Object.assign({}, args), { technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId) }));
        return transferTokens.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    getFeeForTransferLockedTokens() {
        const { fioAddress } = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress'],
        });
        return this.getFee({ fioAddress, endPoint: entities_1.EndPoint.transferLockedTokens });
    }
    getOracleFees() {
        const { publicKey } = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['publicKey'],
        });
        const fioFee = new queries.GetOracleFees(this.config);
        return fioFee.execute(publicKey || this.publicKey);
    }
    getFee() {
        const args = (0, utils_1.resolveOptions)({ keys: ['endPoint', 'fioAddress'], arguments: Array.from(arguments) });
        const fioFee = new queries.GetFee(this.config, args);
        return fioFee.execute(this.publicKey);
    }
    getFeeForRecordObtData() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['payerFioAddress'],
        });
        return this.getFee({ fioAddress: args.payerFioAddress, endPoint: entities_1.EndPoint.recordObtData });
    }
    getFeeForNewFundsRequest() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['payeeFioAddress'],
        });
        return this.getFee({ fioAddress: args.payeeFioAddress, endPoint: entities_1.EndPoint.newFundsRequest });
    }
    getFeeForRejectFundsRequest() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['payerFioAddress'],
        });
        return this.getFee({ fioAddress: args.payerFioAddress, endPoint: entities_1.EndPoint.rejectFundsRequest });
    }
    getFeeForAddPublicAddress() {
        const { fioAddress } = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress'],
        });
        return this.getFee({ fioAddress, endPoint: entities_1.EndPoint.addPublicAddress });
    }
    getFeeForCancelFundsRequest() {
        const { fioAddress } = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress'],
        });
        return this.getFee({ fioAddress, endPoint: entities_1.EndPoint.cancelFundsRequest });
    }
    getFeeForRemovePublicAddresses() {
        const { fioAddress } = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress'],
        });
        return this.getFee({ fioAddress, endPoint: entities_1.EndPoint.removePublicAddress });
    }
    getFeeForRemoveAllPublicAddresses() {
        const { fioAddress } = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress'],
        });
        return this.getFee({ fioAddress, endPoint: entities_1.EndPoint.removeAllPublicAddresses });
    }
    getFeeForBurnFioAddress() {
        const { fioAddress } = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress'],
        });
        return this.getFee({ fioAddress, endPoint: entities_1.EndPoint.burnFioAddress });
    }
    getFeeForTransferFioAddress() {
        const { fioAddress } = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress'],
        });
        return this.getFee({ fioAddress, endPoint: entities_1.EndPoint.transferFioAddress });
    }
    getFeeForAddBundledTransactions() {
        const { fioAddress } = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress'],
        });
        return this.getFee({ fioAddress, endPoint: entities_1.EndPoint.addBundledTransactions });
    }
    getFeeForTransferFioDomain() {
        const { fioAddress } = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['fioAddress'],
        });
        return this.getFee({ fioAddress, endPoint: entities_1.EndPoint.transferFioDomain });
    }
    stakeFioTokens() {
        var arguments_1 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, fioAddress, maxFee, technologyProviderId, } = (0, utils_1.resolveOptions)({
                arguments: Array.from(arguments_1),
                keys: ['amount', 'fioAddress', 'maxFee', 'technologyProviderId'],
            });
            let resolvedMaxFee = maxFee !== null && maxFee !== void 0 ? maxFee : 0;
            if (!maxFee && fioAddress) {
                const { fee: stakeFee } = yield this.getFee({ fioAddress, endPoint: entities_1.EndPoint.stakeFioTokens });
                resolvedMaxFee = stakeFee;
            }
            return this.pushTransaction({
                account: entities_1.Account.staking,
                action: entities_1.Action.stake,
                data: {
                    amount,
                    fio_address: fioAddress,
                    max_fee: resolvedMaxFee,
                    tpid: technologyProviderId,
                },
            });
        });
    }
    unStakeFioTokens() {
        var arguments_2 = arguments;
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, fioAddress, maxFee, technologyProviderId, } = (0, utils_1.resolveOptions)({
                arguments: Array.from(arguments_2),
                keys: ['amount', 'fioAddress', 'maxFee', 'technologyProviderId'],
            });
            let resolvedMaxFee = maxFee !== null && maxFee !== void 0 ? maxFee : 0;
            if (!maxFee && fioAddress) {
                const { fee: stakeFee } = yield this.getFee({ fioAddress, endPoint: entities_1.EndPoint.unStakeFioTokens });
                resolvedMaxFee = stakeFee;
            }
            return this.pushTransaction({
                account: entities_1.Account.staking,
                action: entities_1.Action.unstake,
                data: {
                    amount,
                    fio_address: fioAddress,
                    max_fee: resolvedMaxFee,
                    tpid: technologyProviderId,
                },
            });
        });
    }
    // TODO add more documentation
    getMultiplier() {
        return fioConstants.multiplier;
    }
    /**
     * Allows advance user to send their own content directly to FIO contracts
     *
     * @param options.account Account name
     * @param options.action Name of action
     * @param options.data JSON object with params for action
     * @param options.authPermission
     * @param options.encryptOptions JSON object with params for encryption
     * @param options.signingAccount
     */
    pushTransaction(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { account, action, data, authPermission, encryptOptions = {}, signingAccount, } = (0, utils_1.cleanupObject)(options);
            data.tpid = this.getTechnologyProviderId(data.tpid);
            if (data.content && !encryptOptions.publicKey) {
                switch (action) {
                    case entities_1.Action.newFundsRequest: {
                        const payerKey = yield this.getEncryptKey({
                            fioAddress: data.payer_fio_address,
                        });
                        encryptOptions.publicKey = payerKey.encrypt_public_key;
                        encryptOptions.contentType = entities_1.ContentType.newFundsContent;
                        break;
                    }
                    case entities_1.Action.recordObt: {
                        const payeeKey = yield this.getEncryptKey({
                            fioAddress: data.payee_fio_address,
                        });
                        encryptOptions.publicKey = payeeKey.encrypt_public_key;
                        encryptOptions.contentType = entities_1.ContentType.recordObtDataContent;
                        break;
                    }
                }
            }
            const pushTransaction = new requests.PushTransaction(this.config, {
                account,
                action,
                authPermission,
                data,
                encryptOptions,
                signingAccount,
            });
            return pushTransaction.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
        });
    }
    getAccountPubKey() {
        const args = (0, utils_1.resolveOptions)({ keys: ['account'], arguments: Array.from(arguments) });
        const getAccountPubKey = new queries.GetAccountPubKey(this.config, args);
        return getAccountPubKey.execute(this.publicKey);
    }
    getEncryptKey() {
        const args = (0, utils_1.resolveOptions)({ keys: ['fioAddress'], arguments: Array.from(arguments) });
        const getEncryptKey = new queries.GetEncryptKey(this.config, args);
        return getEncryptKey.execute(this.publicKey);
    }
    genericAction(action, ...args) {
        const [params] = args;
        switch (action) {
            case 'getFioPublicKey':
                return this.getFioPublicKey();
            case 'getAccount':
                return this.getAccount(params);
            case 'registerFioDomainAddress':
                return this.registerFioDomainAddress(params);
            case 'registerFioAddress':
                if ('ownerPublicKey' in params) {
                    return this.registerOwnerFioAddress(params);
                }
                else {
                    return this.registerFioAddress(params);
                }
            case 'registerOwnerFioAddress':
                return this.registerOwnerFioAddress(params);
            case 'transferLockedTokens':
                return this.transferLockedTokens(params);
            case 'registerFioDomain':
                return this.registerFioDomain(params);
            case 'registerOwnerFioDomain':
                return this.registerOwnerFioDomain(params);
            case 'renewFioDomain':
                return this.renewFioDomain(params);
            case 'renewFioAddress':
                return this.renewFioAddress(params);
            case 'burnFioAddress':
                return this.burnFioAddress(params);
            case 'transferFioAddress':
                return this.transferFioAddress(params);
            case 'transferFioDomain':
                return this.transferFioDomain(params);
            case 'addBundledTransactions':
                return this.addBundledTransactions(params);
            case 'addPublicAddress':
                return this.addPublicAddress(params);
            case 'addPublicAddresses':
                return this.addPublicAddresses(params);
            case 'removePublicAddresses':
                return this.removePublicAddresses(params);
            case 'getLocks':
                return this.getLocks(params);
            case 'cancelFundsRequest':
                return this.cancelFundsRequest(params);
            case 'removeAllPublicAddresses':
                return this.removeAllPublicAddresses(params);
            case 'setFioDomainVisibility':
                return this.setFioDomainVisibility(params);
            case 'recordObtData':
                return this.recordObtData(params);
            case 'getFeeForTransferLockedTokens':
                return this.getFeeForTransferLockedTokens(params);
            case 'getObtData':
                return this.getObtData(params);
            case 'getGranteePermissions':
                return this.getGranteePermissions(params);
            case 'getGrantorPermissions':
                return this.getGrantorPermissions(params);
            case 'getObjectPermissions':
                return this.getObjectPermissions(params);
            case 'rejectFundsRequest':
                return this.rejectFundsRequest(params);
            case 'requestFunds':
                return this.requestFunds(params);
            case 'isAvailable':
                return this.isAvailable(params);
            case 'getFioBalance':
                return this.getFioBalance(params);
            case 'getFioNames':
                return this.getFioNames(params);
            case 'getFioDomains':
                return this.getFioDomains(params);
            case 'getFioAddresses':
                return this.getFioAddresses(params);
            case 'getPendingFioRequests':
                return this.getPendingFioRequests(params);
            case 'getReceivedFioRequests':
                return this.getReceivedFioRequests(params);
            case 'getCancelledFioRequests':
                return this.getCancelledFioRequests(params);
            case 'getSentFioRequests':
                return this.getSentFioRequests(params);
            case 'getPublicAddress':
                return this.getPublicAddress(params);
            case 'getFioPublicAddress':
                return this.getFioPublicAddress(params);
            case 'getPublicAddresses':
                return this.getPublicAddresses(params);
            case 'getNfts':
                return this.getNfts(params);
            case 'transferTokens':
                return this.transferTokens(params);
            case 'stakeFioTokens':
                return this.stakeFioTokens(params);
            case 'unStakeFioTokens':
                return this.unStakeFioTokens(params);
            case 'getOracleFees':
                return this.getOracleFees(params);
            case 'getFee':
                return this.getFee(params);
            case 'getAbi':
                return this.getAbi(params);
            case 'getFeeForRecordObtData':
                return this.getFeeForRecordObtData(params);
            case 'getFeeForNewFundsRequest':
                return this.getFeeForNewFundsRequest(params);
            case 'getFeeForRejectFundsRequest':
                return this.getFeeForRejectFundsRequest(params);
            case 'getFeeForBurnFioAddress':
                return this.getFeeForBurnFioAddress(params);
            case 'getFeeForTransferFioAddress':
                return this.getFeeForTransferFioAddress(params);
            case 'getFeeForTransferFioDomain':
                return this.getFeeForTransferFioDomain(params);
            case 'getFeeForAddBundledTransactions':
                return this.getFeeForAddBundledTransactions(params);
            case 'getFeeForAddPublicAddress':
                return this.getFeeForAddPublicAddress(params);
            case 'getFeeForCancelFundsRequest':
                return this.getFeeForCancelFundsRequest(params);
            case 'getFeeForRemovePublicAddresses':
                return this.getFeeForRemovePublicAddresses(params);
            case 'getFeeForRemoveAllPublicAddresses':
                return this.getFeeForRemoveAllPublicAddresses(params);
            case 'getMultiplier':
                return this.getMultiplier();
            case 'pushTransaction':
                return this.pushTransaction(params);
            case 'getAccountPubKey':
                return this.getAccountPubKey(params);
            case 'getEncryptKey':
                return this.getEncryptKey(params);
            default:
                throw new Error('Not supported generic action');
        }
    }
    /**
     * @ignore
     */
    registerFioNameOnBehalfOfUser(fioName, publicKey) {
        const baseUrl = this.registerMockUrl; // "mock.dapix.io/mockd/DEV2"
        const mockRegisterFioName = new requests.MockRegisterFioName({
            baseUrl,
            fioName,
            publicKey,
        });
        return mockRegisterFioName.execute();
    }
    getAbi() {
        const args = (0, utils_1.resolveOptions)({
            arguments: Array.from(arguments),
            keys: ['accountName'],
        });
        const abi = new queries.GetAbi(this.config, args);
        return abi.execute(this.publicKey);
    }
}
exports.FIOSDK = FIOSDK;
/**
 * SUFs = Smallest Units of FIO
 */
FIOSDK.SUFUnit = 1000000000;
//# sourceMappingURL=FIOSDK.js.map