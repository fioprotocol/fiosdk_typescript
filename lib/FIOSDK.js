"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIOSDK = void 0;
const fiojs_1 = require("@fioprotocol/fiojs");
const Get_1 = require("./transactions/queries/Get");
const GetAbi_1 = require("./transactions/queries/GetAbi");
const GetFioBalance_1 = require("./transactions/queries/GetFioBalance");
const GetPublicAddress_1 = require("./transactions/queries/GetPublicAddress");
const GetFee_1 = require("./transactions/queries/GetFee");
const GetNames_1 = require("./transactions/queries/GetNames");
const AvailabilityCheck_1 = require("./transactions/queries/AvailabilityCheck");
const MockRegisterFioName_1 = require("./transactions/signed/MockRegisterFioName");
const PushTransaction_1 = require("./transactions/signed/PushTransaction");
const SignedTransaction_1 = require("./transactions/signed/SignedTransaction");
const Transactions_1 = require("./transactions/Transactions");
const constants_1 = require("./utils/constants");
const validation_1 = require("./utils/validation");
const ValidationError_1 = require("./entities/ValidationError");
/**
 * @ignore
 */
const { Ecc } = require('@fioprotocol/fiojs');
class FIOSDK {
    /**
     * // how to instantiate fetchJson parameter
     * i.e.
     * fetch = require('node-fetch')
     *
     * const fetchJson = async (uri, opts = {}) => {
     *  return fetch(uri, opts)
     * }
     *
     * @param privateKey the fio private key of the client sending requests to FIO API.
     * @param publicKey the fio public key of the client sending requests to FIO API.
     * @param baseUrl the url to the FIO API.
     * @param fetchjson - the module to use for HTTP Post/Get calls (see above for example)
     * @param registerMockUrl the url to the mock server
     * @param technologyProviderId Default FIO Address of the wallet which generates transactions.
     */
    constructor(privateKey, publicKey, baseUrl, fetchjson, registerMockUrl = '', technologyProviderId = '', returnPreparedTrx = false) {
        /**
         * Defines whether SignedTransaction would execute or return prepared transaction
         */
        this.returnPreparedTrx = false;
        this.transactions = new Transactions_1.Transactions();
        Transactions_1.Transactions.baseUrl = baseUrl;
        Transactions_1.Transactions.FioProvider = fiojs_1.Fio;
        Transactions_1.Transactions.fetchJson = fetchjson;
        this.registerMockUrl = registerMockUrl;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        this.technologyProviderId = technologyProviderId;
        this.returnPreparedTrx = returnPreparedTrx;
        for (const accountName of constants_1.Constants.rawAbiAccountName) {
            this.getAbi(accountName)
                .then((response) => {
                Transactions_1.Transactions.abiMap.set(response.account_name, response);
            })
                .catch((error) => {
                throw error;
            });
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
        const publicKey = Ecc.privateToPublic(fioPrivateKey);
        return { publicKey };
    }
    /**
     * Is the Chain Code Valid?
     *
     * @param chainCode
     *
     * @returns Chain Code is Valid
     */
    static isChainCodeValid(chainCode) {
        const validation = validation_1.validate({ chainCode }, { chainCode: validation_1.allRules.chain });
        if (!validation.isValid) {
            throw new ValidationError_1.ValidationError(validation.errors, `Validation error`);
        }
        return true;
    }
    /**
     * Is the Token Code Valid?
     *
     * @param tokenCode
     *
     * @returns Token Code is Valid
     */
    static isTokenCodeValid(tokenCode) {
        const validation = validation_1.validate({ tokenCode }, { tokenCode: validation_1.allRules.chain });
        if (!validation.isValid) {
            throw new ValidationError_1.ValidationError(validation.errors);
        }
        return true;
    }
    /**
     * Is the FIO Address Valid?
     *
     * @param fioAddress
     *
     * @returns Fio Address is Valid
     */
    static isFioAddressValid(fioAddress) {
        const validation = validation_1.validate({ fioAddress }, { fioAddress: validation_1.allRules.fioAddress });
        if (!validation.isValid) {
            throw new ValidationError_1.ValidationError(validation.errors);
        }
        return true;
    }
    /**
     * Is the FIO Domain Valid?
     *
     * @param fioDomain
     *
     * @returns FIO Domain is Valid
     */
    static isFioDomainValid(fioDomain) {
        const validation = validation_1.validate({ fioDomain }, { fioDomain: validation_1.allRules.fioDomain });
        if (!validation.isValid) {
            throw new ValidationError_1.ValidationError(validation.errors);
        }
        return true;
    }
    /**
     * Is the FIO Public Key Valid?
     *
     * @param fioPublicKey
     *
     * @returns FIO Public Key is Valid
     */
    static isFioPublicKeyValid(fioPublicKey) {
        const validation = validation_1.validate({ fioPublicKey }, { fioPublicKey: validation_1.allRules.fioPublicKey });
        if (!validation.isValid) {
            throw new ValidationError_1.ValidationError(validation.errors);
        }
        return true;
    }
    /**
     * Is the Public Address Valid?
     *
     * @param publicAddress
     *
     * @returns Public Address is Valid
     */
    static isPublicAddressValid(publicAddress) {
        const validation = validation_1.validate({ publicAddress }, { publicAddress: validation_1.allRules.nativeBlockchainPublicAddress });
        if (!validation.isValid) {
            throw new ValidationError_1.ValidationError(validation.errors);
        }
        return true;
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
        const remainder = (amount % 1);
        const remainderResult = remainder * (this.SUFUnit);
        const floorRemainder = Math.floor(remainderResult);
        // add integer and remainder
        return tempResult + floorRemainder;
    }
    /**
     * Convert FIO SUFs to a FIO Token amount
     *
     * @param suf
     *
     * @returns FIO Token amount
     */
    static SUFToAmount(suf) {
        return parseInt(`${suf}`) / this.SUFUnit;
    }
    /**
     * Allows advance user to send their own content directly to FIO contracts
     *
     * @param action Name of action
     * @param data JSON object with params for action
     * @param options Options
     * @param options.account Account name
     * @param options.additionalReturnKeys Additional keys for response object from api result
     * @param options.returnPreparedTrx Would return prepared transaction if true
     */
    pushTransaction(action, data, options = {}) {
        data.tpid = this.getTechnologyProviderId(data.tpid);
        const pushTransaction = new PushTransaction_1.PushTransaction(action, data, options);
        return pushTransaction.execute(this.privateKey, this.publicKey, this.returnPreparedTrx || options.returnPreparedTrx);
    }
    get(endpoint, data, options = {}) {
        data.tpid = this.getTechnologyProviderId(data.tpid);
        const get = new Get_1.Get(endpoint, data, options);
        return get.execute(this.publicKey, this.privateKey);
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
        return technologyProviderId !== null ? technologyProviderId : this.technologyProviderId;
    }
    /**
     * Set returnPreparedTrx
     */
    setSignedTrxReturnOption(returnPreparedTrx) {
        this.returnPreparedTrx = returnPreparedTrx;
    }
    /**
     * @ignore
     */
    getAbi(accountName) {
        const abi = new GetAbi_1.GetAbi(accountName);
        return abi.execute(this.publicKey);
    }
    /**
     * Execute prepared transaction.
     *
     * @param endPoint endpoint.
     * @param preparedTrx
     */
    executePreparedTrx(endPoint, preparedTrx) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.transactions.executeCall(`chain/${endPoint}`, JSON.stringify(preparedTrx));
            return SignedTransaction_1.SignedTransaction.prepareResponse(response);
        });
    }
    /**
     * Checks if a FIO Address or FIO Domain is available for registration.
     *
     * @param fioName FIO Address or FIO Domain to check.
     */
    isAvailable(fioName) {
        const availabilityCheck = new AvailabilityCheck_1.AvailabilityCheck(fioName);
        return availabilityCheck.execute(this.publicKey);
    }
    /**
     * Retrieves balance of FIO tokens
     *
     * @param fioPublicKey FIO public key.
     */
    getFioBalance(fioPublicKey) {
        const getFioBalance = new GetFioBalance_1.GetFioBalance(fioPublicKey);
        return getFioBalance.execute(this.publicKey);
    }
    /**
     * Returns FIO Addresses and FIO Domains owned by this public key.
     *
     * @param fioPublicKey FIO public key of owner.
     */
    getFioNames(fioPublicKey) {
        const getNames = new GetNames_1.GetNames(fioPublicKey || this.publicKey);
        return getNames.execute(this.publicKey);
    }
    /**
     * Returns a token public address for specified token code and FIO Address.
     *
     * @param fioAddress FIO Address for which the token public address is to be returned.
     * @param chainCode Blockchain code for which public address is to be returned.
     * @param tokenCode Token code for which public address is to be returned.
     */
    getPublicAddress(fioAddress, chainCode, tokenCode) {
        const publicAddressLookUp = new GetPublicAddress_1.GetPublicAddress(fioAddress, chainCode, tokenCode);
        return publicAddressLookUp.execute(this.publicKey);
    }
    /**
     * Returns the FIO token public address for specified FIO Address.
     *
     * @param fioAddress FIO Address for which fio token public address is to be returned.
     */
    getFioPublicAddress(fioAddress) {
        return this.getPublicAddress(fioAddress, 'FIO', 'FIO');
    }
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param endPoint Name of API call end point, e.g. add_pub_address.
     * @param fioAddress
     *        if endPointName is RenewFioAddress, FIO Address incurring the fee and owned by signer.
     *        if endPointName is RenewFioDomain, FIO Domain incurring the fee and owned by signer.
     *        if endPointName is RecordObtData, Payer FIO Address incurring the fee and owned by signer.
     *
     *        Omit for:
     *        - register_fio_domain
     *        - register_fio_address
     *        - transfer_tokens_pub_key
     */
    getFee(endPoint, fioAddress = '') {
        const fioFee = new GetFee_1.GetFee(endPoint, fioAddress);
        return fioFee.execute(this.publicKey);
    }
    /**
     * @ignore
     */
    registerFioNameOnBehalfOfUser(fioName, publicKey) {
        const server = this.registerMockUrl;
        const mockRegisterFioName = new MockRegisterFioName_1.MockRegisterFioName(fioName, publicKey, server);
        return mockRegisterFioName.execute();
    }
    /**
     * @ignore
     */
    getMultiplier() {
        return constants_1.Constants.multiplier;
    }
}
exports.FIOSDK = FIOSDK;
/**
 * SUFs = Smallest Units of FIO
 */
FIOSDK.SUFUnit = 1000000000;
